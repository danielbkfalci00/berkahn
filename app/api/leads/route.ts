import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { validateLeadInput } from "@/lib/contact";
import { createServiceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

function clientFingerprint(request: NextRequest): string {
  const forwarded =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "unknown";
  const salt =
    process.env.LEAD_FINGERPRINT_SALT ??
    process.env.SUPABASE_SERVICE_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "berkahn-lead";
  return createHash("sha256").update(`${salt}:${forwarded}`).digest("hex");
}

function slugFromPath(path?: string | null): string | null {
  if (!path) return null;
  const match = path.match(/^\/atualidades\/([^/?#]+)/);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function attributionFromRequest(request: NextRequest, fallbackPath?: string) {
  let pagePath = fallbackPath ?? null;
  let utmSource: string | undefined;
  let utmMedium: string | undefined;
  let utmCampaign: string | undefined;
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const url = new URL(referer);
      pagePath = url.pathname;
      utmSource = url.searchParams.get("utm_source")?.slice(0, 160) || undefined;
      utmMedium = url.searchParams.get("utm_medium")?.slice(0, 160) || undefined;
      utmCampaign = url.searchParams.get("utm_campaign")?.slice(0, 160) || undefined;
    } catch {
      // Referer inválido: mantém o path validado enviado pelo formulário.
    }
  }
  return { pagePath, utmSource, utmMedium, utmCampaign };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "JSON inválido." }, { status: 400 });
  }

  const validated = validateLeadInput(body);
  if (!validated.success) {
    return NextResponse.json(validated, { status: 422 });
  }

  const lead = validated.data;
  if (lead.website) {
    return NextResponse.json({ success: true });
  }
  if (lead.startedAt && Date.now() - lead.startedAt < 1_500) {
    return NextResponse.json(
      { success: false, message: "Envio rápido demais. Tente novamente." },
      { status: 429 }
    );
  }

  const supabase = createServiceClient();
  const fingerprint = clientFingerprint(request);
  const cutoff = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count, error: countError } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("request_fingerprint", fingerprint)
    .gte("criado_em", cutoff);

  if (countError) {
    console.error("lead rate limit:", countError.message);
    return NextResponse.json({ success: false, message: "Não foi possível enviar agora." }, { status: 503 });
  }
  if ((count ?? 0) >= MAX_REQUESTS) {
    return NextResponse.json(
      { success: false, message: "Muitas tentativas. Aguarde alguns minutos." },
      { status: 429 }
    );
  }

  const attribution = attributionFromRequest(request, lead.pagePath);
  const slug = slugFromPath(attribution.pagePath);
  let postId: string | null = null;
  let pautaId: string | null = null;
  if (slug) {
    const { data: post } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    postId = post?.id ?? null;
    if (postId) {
      const { data: pauta } = await supabase
        .from("conteudo_pautas")
        .select("id")
        .eq("post_id", postId)
        .maybeSingle();
      pautaId = pauta?.id ?? null;
    }
  }

  const message = [
    lead.message,
    lead.projectType ? `Tipo: ${lead.projectType}` : null,
    lead.company ? `Empresa: ${lead.company}` : null,
    lead.role ? `Cargo: ${lead.role}` : null,
  ]
    .filter(Boolean)
    .join(" | ") || "Contato pelo formulário";

  const { data: saved, error } = await supabase
    .from("leads")
    .insert({
      nome: lead.name,
      email: lead.email ?? null,
      telefone: lead.phone,
      segmento: lead.segment,
      mensagem: message,
      canal: "form",
      pagina_origem: attribution.pagePath,
      slug_origem: slug,
      cta_location: lead.ctaLocation ?? null,
      utm: {
        source: attribution.utmSource ?? lead.utmSource,
        medium: attribution.utmMedium ?? lead.utmMedium,
        campaign: attribution.utmCampaign ?? lead.utmCampaign,
      },
      post_id: postId,
      pauta_id: pautaId,
      request_fingerprint: fingerprint,
    })
    .select("id")
    .single();

  if (error || !saved) {
    console.error("lead insert:", error?.message);
    return NextResponse.json({ success: false, message: "Não foi possível salvar o contato." }, { status: 503 });
  }

  const sheetEndpoint = process.env.GOOGLE_SHEETS_LEAD_ENDPOINT?.trim();
  const sheetSecret = process.env.GOOGLE_SHEETS_LEAD_SECRET?.trim();
  if (sheetEndpoint && sheetSecret) {
    try {
      const response = await fetch(sheetEndpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          sync_secret: sheetSecret,
          lead_id: saved.id,
          name: lead.name,
          email: lead.email ?? "",
          phone: lead.phone,
          segmento: lead.segment,
          origem: attribution.pagePath ?? "",
          pauta: pautaId ?? "",
          status: "novo",
          message,
        }),
        signal: AbortSignal.timeout(8_000),
      });
      const sheetResult = await response.json().catch(() => null) as
        | { success?: boolean; message?: string }
        | null;
      if (!response.ok || sheetResult?.success !== true) {
        throw new Error(sheetResult?.message || `HTTP ${response.status}`);
      }
      await supabase
        .from("leads")
        .update({
          sheet_sync_status: "sincronizado",
          sheet_sync_tentativas: 1,
          sheet_synced_at: new Date().toISOString(),
          sheet_sync_error: null,
        })
        .eq("id", saved.id);
    } catch (sheetError) {
      const message =
        sheetError instanceof Error ? sheetError.message.slice(0, 500) : "Falha desconhecida";
      await supabase
        .from("leads")
        .update({
          sheet_sync_status: "falhou",
          sheet_sync_tentativas: 1,
          sheet_sync_error: message,
        })
        .eq("id", saved.id);
    }
  } else if (sheetEndpoint) {
    console.error("lead sheet sync: GOOGLE_SHEETS_LEAD_SECRET não configurado");
  }

  return NextResponse.json({ success: true, leadId: saved.id });
}
