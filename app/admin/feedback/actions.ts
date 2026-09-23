"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/supabase/sessao";
import {
  MSG_MIGRATION_PENDENTE,
  isStatusFeedback,
  isTabelaAusente,
  isUuid,
  validarCorpo,
  validarNota,
  validarNovoFeedback,
  type StatusFeedback,
} from "@/types/feedback";

type Resultado<T> = { data: T; error: string | null };

// Mesma mensagem de app/admin/conteudo/actions.ts: o PostgREST não dá erro
// quando a RLS filtra a linha, só devolve zero linhas.
const SEM_LINHA =
  "Nada foi gravado. Sua sessão pode ter expirado, abra o admin em outra aba, confirme que está logado e tente de novo.";

function traduzirErro(error: { code?: string; message: string }): string {
  if (isTabelaAusente(error)) return MSG_MIGRATION_PENDENTE;
  if (error.code === "PGRST202" || error.code === "42883") return MSG_MIGRATION_PENDENTE;
  return error.message;
}

function revalidar(id?: string) {
  revalidatePath("/admin/feedback");
  if (id) revalidatePath(`/admin/feedback/${id}`);
}

/**
 * Qualquer membro ativo escreve. autor_id e autor_nome vão preenchidos para
 * passar na policy, mas o trigger da 034 os sobrescreve a partir da sessão:
 * o valor daqui não é fonte de verdade.
 */
export async function criarFeedback(input: {
  titulo: string;
  categoria: string;
  descricao: string;
  paginaOrigem: string | null;
}): Promise<Resultado<{ id: string } | null>> {
  const session = await getAdminSession();
  if (!session) return { data: null, error: "Sessão expirada. Entre de novo no admin." };

  const validado = validarNovoFeedback(input);
  if (!validado.ok) return { data: null, error: validado.erro };
  const { titulo, categoria, descricao, paginaOrigem } = validado.valor;
  const { supabase, user, membership } = session;

  const { data, error } = await supabase
    .from("feedback_itens")
    .insert({
      titulo,
      categoria,
      pagina_origem: paginaOrigem,
      autor_id: user.id,
      autor_nome: membership.nome,
    })
    .select("id");
  if (error) return { data: null, error: traduzirErro(error) };
  const id = data?.[0]?.id;
  if (!id) return { data: null, error: SEM_LINHA };

  if (descricao) {
    const { data: msg, error: erroMsg } = await supabase
      .from("feedback_mensagens")
      .insert({ item_id: id, corpo: descricao, autor_id: user.id, autor_nome: membership.nome })
      .select("id");
    // Sem DELETE para authenticated, o item não pode ser desfeito. Melhor
    // devolver o id e dizer o que faltou do que esconder um item órfão.
    if (erroMsg || !msg?.length) {
      revalidar(id);
      return {
        data: { id },
        error: "O feedback foi criado, mas a descrição não foi gravada. Abra o item e escreva de novo.",
      };
    }
  }

  revalidar(id);
  return { data: { id }, error: null };
}

export async function responder(input: {
  itemId: string;
  corpo: string;
}): Promise<Resultado<null>> {
  const session = await getAdminSession();
  if (!session) return { data: null, error: "Sessão expirada. Entre de novo no admin." };
  if (!isUuid(input.itemId)) return { data: null, error: "Feedback inválido." };

  const corpo = validarCorpo(input.corpo);
  if (!corpo.ok) return { data: null, error: corpo.erro };

  const { data, error } = await session.supabase
    .from("feedback_mensagens")
    .insert({
      item_id: input.itemId,
      corpo: corpo.valor,
      autor_id: session.user.id,
      autor_nome: session.membership.nome,
    })
    .select("id");
  if (error) return { data: null, error: traduzirErro(error) };
  if (!data?.length) return { data: null, error: SEM_LINHA };

  revalidar(input.itemId);
  return { data: null, error: null };
}

/**
 * Só owner. A checagem aqui é para responder rápido e com mensagem clara; a
 * barreira real é a RPC set_feedback_status, que recusa quem não é owner.
 */
export async function definirStatus(input: {
  itemId: string;
  status: StatusFeedback;
  nota: string | null;
}): Promise<Resultado<null>> {
  const session = await getAdminSession();
  if (!session || session.membership.role !== "owner") {
    return { data: null, error: "Só o proprietário muda o status." };
  }
  if (!isUuid(input.itemId)) return { data: null, error: "Feedback inválido." };
  if (!isStatusFeedback(input.status)) return { data: null, error: "Status inválido." };
  const nota = validarNota(input.nota);
  if (!nota.ok) return { data: null, error: nota.erro };

  const { error } = await session.supabase.rpc("set_feedback_status", {
    p_id: input.itemId,
    p_status: input.status,
    p_nota: nota.valor,
  });
  if (error) return { data: null, error: traduzirErro(error) };

  // A RPC levanta exceção quando não encontra a linha, então não há o caso
  // silencioso de zero linhas. Mesmo assim, relê para confirmar o estado.
  const { data, error: erroLeitura } = await session.supabase
    .from("feedback_itens")
    .select("status")
    .eq("id", input.itemId);
  if (erroLeitura) return { data: null, error: traduzirErro(erroLeitura) };
  if (data?.[0]?.status !== input.status) return { data: null, error: SEM_LINHA };

  revalidar(input.itemId);
  return { data: null, error: null };
}
