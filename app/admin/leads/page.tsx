import { LeadsQueue, type LeadKpis } from "@/components/admin/analytics/LeadsQueue";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsLead, LeadChannel, LeadSegment, LeadStatus } from "@/types/analytics";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;
const LEAD_COLUMNS = "id,nome,email,telefone,telefone_normalizado,segmento,mensagem,canal,status,tipo_projeto,empresa,cargo,pagina_origem,landing_page,referrer,slug_origem,cta_location,utm,post_id,pauta_id,visualizado_em,ultimo_contato_em,proxima_acao_em,motivo_desqualificacao,qualificado_em,desqualificado_em,convertido_em,arquivado_em,anonimizado_em,origem_legado,importado_em,sheet_sync_status,sheet_sync_tentativas,sheet_sync_error,criado_em";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: LeadStatus;
    canal?: LeadChannel;
    segmento?: LeadSegment;
    periodo?: string;
    vencida?: string;
    arquivados?: string;
    page?: string;
  }>;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select(LEAD_COLUMNS, { count: "exact" })
    .order("criado_em", { ascending: false });

  const safeSearch = params.q?.trim().slice(0, 120).replace(/[,()%]/g, " ");
  if (safeSearch) {
    const normalizedPhone = safeSearch.replace(/\D/g, "");
    const filters = [
      `nome.ilike.%${safeSearch}%`,
      `email.ilike.%${safeSearch}%`,
      `telefone.ilike.%${safeSearch}%`,
    ];
    if (normalizedPhone.length >= 3) {
      filters.push(`telefone_normalizado.ilike.%${normalizedPhone}%`);
    }
    query = query.or(filters.join(","));
  }
  if (params.status) query = query.eq("status", params.status);
  if (params.canal) query = query.eq("canal", params.canal);
  if (params.segmento) query = query.eq("segmento", params.segmento);
  if (params.periodo && ["7", "28", "90"].includes(params.periodo)) {
    const from = new Date();
    from.setUTCDate(from.getUTCDate() - Number(params.periodo));
    query = query.gte("criado_em", from.toISOString());
  }
  if (params.vencida === "1") query = query.lt("proxima_acao_em", new Date().toISOString());
  query = params.arquivados === "1" ? query.not("arquivado_em", "is", null) : query.is("arquivado_em", null);

  const from = (page - 1) * PAGE_SIZE;
  const [{ data, count, error }, kpis] = await Promise.all([
    query.range(from, from + PAGE_SIZE - 1),
    getLeadKpis(),
  ]);
  if (error) throw new Error(`Falha ao carregar leads: ${error.message}`);

  const total = count ?? 0;
  return (
    <LeadsQueue
      initialLeads={(data ?? []) as unknown as AnalyticsLead[]}
      total={total}
      page={page}
      pageCount={Math.ceil(total / PAGE_SIZE)}
      kpis={kpis}
    />
  );
}

async function getLeadKpis(): Promise<LeadKpis> {
  const supabase = await createClient();
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 28);
  const { data, error } = await supabase
    .from("leads")
    .select("status,qualificado_em,convertido_em")
    .gte("criado_em", since.toISOString())
    .is("arquivado_em", null)
    .is("anonimizado_em", null);
  if (error || !data) return { received: 0, new: 0, qualified: 0, converted: 0, eligible: 0 };

  const statuses = data.map((lead) => lead.status as LeadStatus);
  return {
    received: statuses.length,
    new: statuses.filter((status) => status === "novo").length,
    qualified: data.filter((lead) => Boolean(lead.qualificado_em)).length,
    converted: data.filter((lead) => Boolean(lead.convertido_em)).length,
    eligible: statuses.length,
  };
}
