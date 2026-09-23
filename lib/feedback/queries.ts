import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  MSG_MIGRATION_PENDENTE,
  isTabelaAusente,
  isUuid,
  toItemFeedback,
  toMensagemFeedback,
  type FiltroFeedback,
  type ItemFeedback,
  type ItemFeedbackRow,
  type MensagemFeedback,
  type MensagemFeedbackRow,
} from "@/types/feedback";

// Leituras do mural, compartilhadas pela lista e pelo detalhe. Separadas das
// actions pelo mesmo motivo de lib/documentacoes/queries.ts: página lê, action escreve.

const COLUNAS_ITEM =
  "id, titulo, categoria, status, pagina_origem, autor_nome, implementado_em, " +
  "implementado_por, nota_implementacao, criado_em, atualizado_em";

/** `pendente` = migration 034 não aplicada. A UI mostra aviso em vez de quebrar. */
export type Leitura<T> =
  | { estado: "ok"; data: T }
  | { estado: "pendente"; mensagem: string }
  | { estado: "erro"; mensagem: string };

export async function listarFeedback(filtro: FiltroFeedback): Promise<Leitura<ItemFeedback[]>> {
  const supabase = await createClient();
  // O count embutido vem numa query só; sem ele seriam N contagens por página.
  let query = supabase
    .from("feedback_itens")
    .select(`${COLUNAS_ITEM}, feedback_mensagens(count)`)
    .order("atualizado_em", { ascending: false })
    .limit(200);
  if (filtro !== "todos") query = query.eq("status", filtro);

  const { data, error } = await query;
  if (error) {
    if (isTabelaAusente(error)) return { estado: "pendente", mensagem: MSG_MIGRATION_PENDENTE };
    return { estado: "erro", mensagem: error.message };
  }
  return { estado: "ok", data: ((data ?? []) as unknown as ItemFeedbackRow[]).map(toItemFeedback) };
}

export async function buscarFeedback(
  id: string
): Promise<Leitura<{ item: ItemFeedback; mensagens: MensagemFeedback[] } | null>> {
  if (!isUuid(id)) return { estado: "ok", data: null };
  const supabase = await createClient();
  const [{ data: item, error }, { data: mensagens, error: erroMsgs }] = await Promise.all([
    supabase.from("feedback_itens").select(COLUNAS_ITEM).eq("id", id).maybeSingle(),
    supabase
      .from("feedback_mensagens")
      .select("id, item_id, autor_id, autor_nome, corpo, origem, criado_em")
      .eq("item_id", id)
      .order("criado_em", { ascending: true }),
  ]);
  const falha = error ?? erroMsgs;
  if (falha) {
    if (isTabelaAusente(falha)) return { estado: "pendente", mensagem: MSG_MIGRATION_PENDENTE };
    return { estado: "erro", mensagem: falha.message };
  }
  if (!item) return { estado: "ok", data: null };
  const lista = ((mensagens ?? []) as MensagemFeedbackRow[]).map(toMensagemFeedback);
  return {
    estado: "ok",
    data: {
      item: { ...toItemFeedback(item as unknown as ItemFeedbackRow), totalMensagens: lista.length },
      mensagens: lista,
    },
  };
}
