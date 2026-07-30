"use server";

import { createClient } from "@/lib/supabase/server";
import {
  LIMITES,
  toComentario,
  toThread,
  type Ancora,
  type Comentario,
  type Thread,
  type ThreadRow,
  type TipoComentario,
  isTipoComentario,
} from "@/types/comentario";

type Resultado<T> = { data: T; error: string | null };

const SLUG_PATTERN = /^[a-z0-9-]+$/;

const COLUNAS_COMENTARIO =
  "id, thread_id, corpo, tipo, autor_nome, autor_user_id, editado_em, criado_em";

/**
 * Nada aqui confia no cliente.
 *
 * A âncora nasce dentro do iframe e o corpo vem de um textarea; os dois são
 * entrada não confiável. Sem cortar o tamanho, um Ctrl+A no documento viraria
 * uma thread de dezenas de KB. Os limites espelham os CHECK da migration 009 —
 * cortar aqui devolve erro legível em vez de estourar no banco.
 */
function limpar(texto: string | null | undefined, max: number): string {
  return (texto ?? "").trim().slice(0, max);
}

function validarAncora(ancora: Ancora): string | null {
  const quote = ancora?.textoExato?.trim() ?? "";
  if (quote.length < LIMITES.quoteMin) {
    return `Selecione ao menos ${LIMITES.quoteMin} caracteres.`;
  }
  if (quote.length > LIMITES.quoteMax) {
    return "Trecho selecionado é longo demais para comentar.";
  }
  return null;
}

async function autor(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Cria uma thread e o primeiro comentário. */
export async function criarThread(input: {
  documentoSlug: string;
  ancora: Ancora;
  corpo: string;
  tipo: TipoComentario;
  autorNome: string;
  /** documentos.atualizado_em no momento da criação, para detectar defasagem. */
  docVersao: string | null;
}): Promise<Resultado<Thread | null>> {
  if (!SLUG_PATTERN.test(input.documentoSlug)) {
    return { data: null, error: "Documento inválido." };
  }

  const erroAncora = validarAncora(input.ancora);
  if (erroAncora) return { data: null, error: erroAncora };

  const corpo = limpar(input.corpo, LIMITES.corpoMax);
  if (!corpo) return { data: null, error: "Escreva um comentário." };

  const autorNome = limpar(input.autorNome, LIMITES.autorMax);
  if (!autorNome) return { data: null, error: "Informe seu nome." };

  const tipo = isTipoComentario(input.tipo) ? input.tipo : "comentario";

  const supabase = await createClient();
  const user = await autor(supabase);

  const { data: thread, error: erroThread } = await supabase
    .from("documento_threads")
    .insert({
      documento_slug: input.documentoSlug,
      texto_exato: input.ancora.textoExato.trim().slice(0, LIMITES.quoteMax),
      prefixo: limpar(input.ancora.prefixo, LIMITES.contexto),
      sufixo: limpar(input.ancora.sufixo, LIMITES.contexto),
      posicao_relativa: Math.min(1, Math.max(0, input.ancora.posicaoRelativa || 0)),
      ancora_secao: limpar(input.ancora.ancoraSecao, 200) || null,
      doc_versao: input.docVersao,
      criado_por: autorNome,
    })
    .select("id")
    .single();

  if (erroThread || !thread) {
    return { data: null, error: erroThread?.message ?? "Falha ao criar a thread." };
  }

  const { error: erroComentario } = await supabase
    .from("documento_comentarios")
    .insert({
      thread_id: (thread as { id: string }).id,
      corpo,
      tipo,
      autor_nome: autorNome,
      autor_user_id: user?.id ?? null,
    });

  if (erroComentario) {
    // Thread sem comentário nenhum é lixo: não aparece em lugar nenhum da UI e
    // ainda assim pinta um destaque no documento. Desfaz.
    await supabase
      .from("documento_threads")
      .delete()
      .eq("id", (thread as { id: string }).id);
    return { data: null, error: erroComentario.message };
  }

  return buscarThread(supabase, (thread as { id: string }).id);
}

/** Adiciona um comentário a uma thread existente. */
export async function responder(input: {
  threadId: string;
  corpo: string;
  tipo: TipoComentario;
  autorNome: string;
}): Promise<Resultado<Comentario | null>> {
  const corpo = limpar(input.corpo, LIMITES.corpoMax);
  if (!corpo) return { data: null, error: "Escreva uma resposta." };

  const autorNome = limpar(input.autorNome, LIMITES.autorMax);
  if (!autorNome) return { data: null, error: "Informe seu nome." };

  const supabase = await createClient();
  const user = await autor(supabase);

  const { data, error } = await supabase
    .from("documento_comentarios")
    .insert({
      thread_id: input.threadId,
      corpo,
      tipo: isTipoComentario(input.tipo) ? input.tipo : "comentario",
      autor_nome: autorNome,
      autor_user_id: user?.id ?? null,
    })
    .select(COLUNAS_COMENTARIO)
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "Falha ao responder." };
  }
  return { data: toComentario(data as never), error: null };
}

/** Edita corpo e/ou tipo de um comentário. */
export async function editarComentario(input: {
  id: string;
  corpo: string;
  tipo: TipoComentario;
}): Promise<Resultado<Comentario | null>> {
  const corpo = limpar(input.corpo, LIMITES.corpoMax);
  if (!corpo) return { data: null, error: "O comentário não pode ficar vazio." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documento_comentarios")
    .update({
      corpo,
      tipo: isTipoComentario(input.tipo) ? input.tipo : "comentario",
      editado_em: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select(COLUNAS_COMENTARIO)
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "Falha ao editar." };
  }
  return { data: toComentario(data as never), error: null };
}

/**
 * Exclui um comentário. Se for o último da thread, exclui a thread junto —
 * senão sobraria um destaque no documento sem nada atrás dele.
 */
export async function excluirComentario(input: {
  id: string;
  threadId: string;
}): Promise<Resultado<{ threadRemovida: boolean }>> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("documento_comentarios")
    .delete()
    .eq("id", input.id);
  if (error) return { data: { threadRemovida: false }, error: error.message };

  const { count } = await supabase
    .from("documento_comentarios")
    .select("id", { count: "exact", head: true })
    .eq("thread_id", input.threadId);

  if ((count ?? 0) === 0) {
    await supabase.from("documento_threads").delete().eq("id", input.threadId);
    return { data: { threadRemovida: true }, error: null };
  }
  return { data: { threadRemovida: false }, error: null };
}

/** Alterna entre aberto e resolvido. */
export async function alternarResolucao(input: {
  threadId: string;
  resolver: boolean;
  autorNome: string;
}): Promise<Resultado<Thread | null>> {
  const supabase = await createClient();
  const autorNome = limpar(input.autorNome, LIMITES.autorMax);

  const { error } = await supabase
    .from("documento_threads")
    .update({
      status: input.resolver ? "resolvido" : "aberto",
      resolvido_por: input.resolver ? autorNome || "Admin" : null,
      resolvido_em: input.resolver ? new Date().toISOString() : null,
    })
    .eq("id", input.threadId);

  if (error) return { data: null, error: error.message };
  return buscarThread(supabase, input.threadId);
}

/**
 * Relê a thread inteira depois de escrever.
 *
 * Sem `revalidatePath` de propósito: a página inteira recarregaria e o iframe
 * do documento remontaria, perdendo o scroll e refazendo o handshake a cada
 * comentário. Mesma razão documentada em `reorderTasks`
 * (app/admin/analytics/actions.ts). O cliente mescla o retorno no estado local.
 */
async function buscarThread(
  supabase: Awaited<ReturnType<typeof createClient>>,
  id: string
): Promise<Resultado<Thread | null>> {
  const { data, error } = await supabase
    .from("documento_threads")
    .select(
      `id, documento_slug, texto_exato, prefixo, sufixo, posicao_relativa,
       ancora_secao, doc_versao, status, resolvido_por, resolvido_em,
       criado_por, criado_em,
       documento_comentarios (${COLUNAS_COMENTARIO})`
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "Thread não encontrada." };
  }
  return { data: toThread(data as unknown as ThreadRow), error: null };
}
