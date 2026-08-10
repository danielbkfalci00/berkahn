import { createHash } from "node:crypto";
import { after, NextResponse, type NextRequest } from "next/server";
import { validateLeadInput, type LeadInput } from "@/lib/contact";
import { dispatchLeadPushNotifications } from "@/lib/push/dispatch";
import { createServiceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 15;

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

function attributionFromRequest(request: NextRequest, lead: LeadInput) {
  let pagePath = lead.pagePath ?? null;
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      pagePath = new URL(referer).pathname;
    } catch {
      // Referer inválido: preserva o path validado enviado pelo formulário.
    }
  }

  if (!lead.attributionConsent) {
    return { pagePath, landingPage: null, referrer: null, utm: {} };
  }

  return {
    pagePath,
    landingPage: safeLandingPath(lead.landingPage),
    referrer: safeReferrer(lead.referrer),
    utm: {
      source: lead.utmSource,
      medium: lead.utmMedium,
      campaign: lead.utmCampaign,
      content: lead.utmContent,
      term: lead.utmTerm,
    },
  };
}

function safeLandingPath(value?: string): string | null {
  if (!value?.startsWith("/")) return null;
  return value.split(/[?#]/, 1)[0].slice(0, 500);
}

function safeReferrer(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return null;
  }
}

async function notifyLead(leadId: string) {
  const endpoint = process.env.GOOGLE_SHEETS_LEAD_ENDPOINT?.trim();
  const secret = process.env.GOOGLE_SHEETS_LEAD_SECRET?.trim();
  if (!endpoint) return;
  if (!secret) {
    console.error("lead notification: GOOGLE_SHEETS_LEAD_SECRET não configurado");
    return;
  }

  const supabase = createServiceClient();
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ sync_secret: secret, lead_id: leadId }),
      signal: AbortSignal.timeout(8_000),
    });
    const result = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;
    if (!response.ok || result?.success !== true) {
      throw new Error(result?.message || `HTTP ${response.status}`);
    }
    const { error: syncError } = await supabase
      .from("leads")
      .update({
        sheet_sync_status: "sincronizado",
        sheet_sync_tentativas: 1,
        sheet_synced_at: new Date().toISOString(),
        sheet_sync_error: null,
      })
      .eq("id", leadId);
    if (syncError) console.error("lead notification state:", syncError.message);
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "Falha desconhecida";
    const { error: syncError } = await supabase
      .from("leads")
      .update({
        sheet_sync_status: "falhou",
        sheet_sync_tentativas: 1,
        sheet_sync_error: message,
      })
      .eq("id", leadId);
    if (syncError) console.error("lead notification failure state:", syncError.message);
  }
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

  const attribution = attributionFromRequest(request, lead);
  const conversionSlug = slugFromPath(attribution.pagePath);
  const landingSlug = slugFromPath(attribution.landingPage);
  const slug = conversionSlug ?? landingSlug;
  let postId: string | null = null;
  let pautaId: string | null = null;
  if (slug) {
    const { data: post } = await supabase.from("posts").select("id").eq("slug", slug).maybeSingle();
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

  const { data: saved, error } = await supabase
    .from("leads")
    .insert({
      nome: lead.name,
      email: lead.email?.trim().toLowerCase() ?? null,
      telefone: lead.phone,
      segmento: lead.segment,
      mensagem: lead.message || "Contato pelo formulário",
      canal: "form",
      tipo_projeto: lead.projectType ?? null,
      empresa: lead.company ?? null,
      cargo: lead.role ?? null,
      pagina_origem: attribution.pagePath,
      landing_page: attribution.landingPage,
      referrer: attribution.referrer,
      slug_origem: slug,
      cta_location: lead.ctaLocation ?? null,
      utm: attribution.utm,
      post_id: postId,
      pauta_id: pautaId,
      request_fingerprint: fingerprint,
    })
    .select("id")
    .single();

  if (error || !saved) {
    console.error("lead insert:", error?.message);
    return NextResponse.json(
      { success: false, message: "Não foi possível salvar o contato." },
      { status: 503 }
    );
  }

  after(async () => {
    const [, pushResult] = await Promise.allSettled([
      notifyLead(saved.id),
      dispatchLeadPushNotifications(),
    ]);
    if (pushResult.status === "rejected") {
      console.error("lead push:", pushResult.reason instanceof Error ? pushResult.reason.message : "unknown error");
    }
  });
  return NextResponse.json({ success: true, leadId: saved.id });
}
