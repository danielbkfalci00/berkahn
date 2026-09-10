// Query server-side dos leads para o funil do Ato 4.
// Molde de lib/analytics/tasks-queries.ts.
import "server-only";
import { createClient } from "@/lib/supabase/server";
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
  const { data, error } = await supabase
    .from("leads")
    .select("id,status,responsavel_id,proxima_acao_em,criado_em")
    .in("status", [...ACTIVE_LEAD_STATUSES])
    .is("arquivado_em", null)
    .is("anonimizado_em", null);

  if (error || !data) {
    console.error("Falha ao carregar pendencias do dashboard", error);
    return { status: "unavailable", reason: "Não foi possível consultar o CRM agora." };
  }

  const now = Date.now();
  const scheduled = data
    .filter((lead) => Boolean(lead.proxima_acao_em))
    .sort((a, b) => new Date(a.proxima_acao_em!).getTime() - new Date(b.proxima_acao_em!).getTime());
  const next = scheduled[0] ?? null;

  return {
    status: "ok",
    data: {
      newCount: data.filter((lead) => lead.status === "novo").length,
      overdueCount: scheduled.filter((lead) => new Date(lead.proxima_acao_em!).getTime() < now).length,
      unassignedCount: data.filter((lead) => !lead.responsavel_id).length,
      nextLeadId: next?.id ?? null,
      nextActionAt: next?.proxima_acao_em ?? null,
      nextActionOverdue: next ? new Date(next.proxima_acao_em!).getTime() < now : false,
    },
  };
}

/**
 * Leads criados dentro do mês, para o funil.
 *
 * Seleciona colunas nominais em vez de `*`: a tabela `leads` carrega PII
 * (nome, e-mail, telefone, mensagem) que o dashboard não usa e não deve
 * trafegar. O funil precisa só de status, origem e datas.
 */
export async function listarLeadsDoMes(monthSlug: string): Promise<AdminDataResult<LeadParaFunil[]>> {
  if (!/^\d{4}-\d{2}$/.test(monthSlug)) {
    return { status: "unavailable", reason: "Período de leads inválido." };
  }

  const inicio = `${monthSlug}-01`;
  const [ano, mes] = monthSlug.split("-").map(Number);
  const proximoAno = mes === 12 ? ano + 1 : ano;
  const proximoMes = mes === 12 ? 1 : mes + 1;
  const fim = `${proximoAno}-${String(proximoMes).padStart(2, "0")}-01`;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(
      "status, canal, segmento, cta_location, pagina_origem, post_id, utm, criado_em, qualificado_em, convertido_em"
    )
    .gte("criado_em", inicio)
    .lt("criado_em", fim)
    .is("arquivado_em", null)
    .is("anonimizado_em", null);

  if (error || !data) {
    console.error("Falha ao carregar o funil de leads", error);
    return { status: "unavailable", reason: "Não foi possível consultar o CRM agora." };
  }
  return { status: "ok", data: data as unknown as LeadParaFunil[] };
}
