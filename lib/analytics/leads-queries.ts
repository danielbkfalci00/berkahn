// Query server-side dos leads para o funil do Ato 4.
// Molde de lib/analytics/tasks-queries.ts.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/supabase/sessao";
import { roleCanAccessPath } from "@/lib/admin/access";
import type { LeadParaFunil } from "./leads-funnel";
import type { AdminDataResult } from "@/types/analytics";

export interface DashboardLeadOperations {
  newCount: number;
  overdueCount: number;
  unassignedCount: number;
  nextLeadId: string | null;
  nextActionAt: string | null;
  nextActionOverdue: boolean;
}

const ACTIVE_LEAD_STATUSES = ["novo", "em_contato", "qualificado", "proposta_enviada"] as const;

/** Resumo operacional sem carregar nome, contato, mensagem ou atribuição. */
export async function getDashboardLeadOperations(): Promise<AdminDataResult<DashboardLeadOperations>> {
  const supabase = await createClient();
  const active = () => supabase.from("leads").select("id", { count: "exact", head: true })
    .in("status", [...ACTIVE_LEAD_STATUSES]).is("arquivado_em", null).is("anonimizado_em", null);
  const now = new Date().toISOString();
  const [fresh, overdue, unassigned, nextResult] = await Promise.all([
    active().eq("status", "novo"), active().lt("proxima_acao_em", now), active().is("responsavel_id", null),
    supabase.from("leads").select("id,proxima_acao_em")
      .in("status", [...ACTIVE_LEAD_STATUSES]).is("arquivado_em", null).is("anonimizado_em", null)
      .not("proxima_acao_em", "is", null).order("proxima_acao_em").order("prioridade_ordem").order("id").limit(1),
  ]);
  if ([fresh, overdue, unassigned, nextResult].some((result) => result.error)) {
    return { status: "unavailable", reason: "Não foi possível consultar o CRM agora." };
  }
  const next = nextResult.data?.[0];
  return { status: "ok", data: {
    newCount: fresh.count || 0, overdueCount: overdue.count || 0, unassignedCount: unassigned.count || 0,
    nextLeadId: next?.id || null, nextActionAt: next?.proxima_acao_em || null,
    nextActionOverdue: Boolean(next?.proxima_acao_em && next.proxima_acao_em < now),
  } };
}

/**
 * Leads criados dentro do mês, para o funil.
 *
 * Seleciona colunas nominais em vez de `*`: a tabela `leads` carrega PII
 * (nome, e-mail, telefone, mensagem) que o dashboard não usa e não deve
 * trafegar. O funil precisa só de status, origem e datas.
 */
export async function listarLeadsDoMes(monthSlug: string, periodEnd?: string): Promise<AdminDataResult<LeadParaFunil[]>> {
  const session = await getAdminSession();
  if (!session || !roleCanAccessPath(session.membership.role, "/admin/leads")) {
    return { status: "unavailable", reason: "Seu perfil não tem acesso aos dados do CRM." };
  }
  if (!/^\d{4}-\d{2}$/.test(monthSlug)) {
    return { status: "unavailable", reason: "Período de leads inválido." };
  }

  const inicio = `${monthSlug}-01`;
  const [ano, mes] = monthSlug.split("-").map(Number);
  const proximoAno = mes === 12 ? ano + 1 : ano;
  const proximoMes = mes === 12 ? 1 : mes + 1;
  let fim = `${proximoAno}-${String(proximoMes).padStart(2, "0")}-01`;
  if (periodEnd) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(periodEnd) || !Number.isFinite(Date.parse(`${periodEnd}T00:00:00Z`))) return { status: "unavailable", reason: "Corte do período inválido." };
    const exclusiveEnd = new Date(`${periodEnd}T00:00:00Z`);
    exclusiveEnd.setUTCDate(exclusiveEnd.getUTCDate() + 1);
    fim = exclusiveEnd.toISOString().slice(0, 10) < fim ? exclusiveEnd.toISOString().slice(0, 10) : fim;
  }

  // Arquivar organiza a fila, sem apagar a aquisição nem mudar a conversão.
  // A coorte mantém arquivados e continua excluindo dados anonimizados.
  const supabase = session.supabase;
  const query = supabase
    .from("leads")
    .select(
      "status, canal, segmento, cta_location, pagina_origem, post_id, utm, criado_em, qualificado_em, convertido_em"
    )
    .gte("criado_em", inicio)
    .lt("criado_em", fim)
    .is("anonimizado_em", null).order("criado_em").order("id");

  const rows: LeadParaFunil[] = [];
  for (let offset = 0; offset < 10000; offset += 1000) {
    const { data, error } = await query.range(offset, offset + 999);
    if (error || !data) return { status: "unavailable", reason: "Não foi possível consultar o CRM agora." };
    rows.push(...data as unknown as LeadParaFunil[]);
    if (data.length < 1000) return { status: "ok", data: rows };
  }
  return { status: "unavailable", reason: "O período excede o limite de consulta. Use um período menor." };
}
