// Query server-side dos leads para o funil do Ato 4.
// Molde de lib/analytics/tasks-queries.ts.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { LeadParaFunil } from "./leads-funnel";

/**
 * Leads criados dentro do mês, para o funil.
 *
 * Seleciona colunas nominais em vez de `*`: a tabela `leads` carrega PII
 * (nome, e-mail, telefone, mensagem) que o dashboard não usa e não deve
 * trafegar. O funil precisa só de status, origem e datas.
 */
export async function listarLeadsDoMes(monthSlug: string): Promise<LeadParaFunil[]> {
  if (!/^\d{4}-\d{2}$/.test(monthSlug)) return [];

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
    .is("anonimizado_em", null);

  if (error || !data) return [];
  return data as unknown as LeadParaFunil[];
}
