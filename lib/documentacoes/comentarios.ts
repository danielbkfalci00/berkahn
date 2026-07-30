// Queries server-side dos comentários inline de /admin/documentacoes
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { toThread, type Thread, type ThreadRow } from "@/types/comentario";

// Mesmo guard de lib/documentacoes/queries.ts: slug vem da URL.
const SLUG_PATTERN = /^[a-z0-9-]+$/;

// Join embutido do PostgREST. A FK thread_id -> documento_threads.id torna o
// embedding possível numa query só, em vez de N+1 por thread.
const COLUNAS_THREAD = `
  id, documento_slug, texto_exato, prefixo, sufixo, posicao_relativa,
  ancora_secao, doc_versao, status, resolvido_por, resolvido_em,
  criado_por, criado_em,
  documento_comentarios (
    id, thread_id, corpo, tipo, autor_nome, autor_user_id, editado_em, criado_em
  )
`;

/** Threads de um documento, da mais recente para a mais antiga. */
export async function listarThreads(slug: string): Promise<Thread[]> {
  if (!SLUG_PATTERN.test(slug)) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documento_threads")
    .select(COLUNAS_THREAD)
    .eq("documento_slug", slug)
    .order("criado_em", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as ThreadRow[]).map(toThread);
}

/**
 * Quantidade de threads abertas por slug, para o badge da listagem.
 * Traz só a coluna de slug e conta em memória: o acervo tem uma dezena de
 * documentos, e PostgREST não faz GROUP BY sem uma view dedicada.
 */
export async function contarThreadsAbertas(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documento_threads")
    .select("documento_slug")
    .eq("status", "aberto");

  if (error || !data) return {};

  const contagem: Record<string, number> = {};
  for (const row of data as { documento_slug: string }[]) {
    contagem[row.documento_slug] = (contagem[row.documento_slug] ?? 0) + 1;
  }
  return contagem;
}
