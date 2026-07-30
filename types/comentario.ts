// Tipos dos comentários inline das documentações
// Tabelas: documento_threads, documento_comentarios
// (supabase/migrations/009_documentacao_comentarios.sql)

export type TipoComentario =
  | "comentario"
  | "duvida"
  | "aprovacao"
  | "reprovacao";

export type StatusThread = "aberto" | "resolvido";

/**
 * Limites de tamanho do payload da âncora e do comentário.
 *
 * Espelham os CHECK da migration 009 e são reaplicados nas server actions: o
 * payload nasce dentro do iframe, então é entrada não confiável — sem cap, um
 * Ctrl+A vira uma thread de 30 KB.
 *
 * ⚠️ `lib/documentacoes/ancoragem.ts` repete estes números literalmente porque
 * não pode importar nada (ver a nota de serialização em bridge.ts). Mudou aqui,
 * mude lá.
 */
export const LIMITES = {
  quoteMin: 4,
  quoteMax: 2000,
  contexto: 100,
  corpoMax: 5000,
  autorMax: 80,
} as const;

export const TIPO_LABEL: Record<TipoComentario, string> = {
  comentario: "Comentário",
  duvida: "Dúvida",
  aprovacao: "Aprovo",
  reprovacao: "Reprovo",
};

/**
 * Âncora de um trecho no documento, no modelo W3C Web Annotation.
 * Trafega entre o iframe e o admin por postMessage e é persistida como parte
 * da thread. Nenhum campo é um id de elemento: o HTML é regenerado por upsert
 * e qualquer id posicional muda junto com o conteúdo.
 */
export interface Ancora {
  /** Trecho selecionado, já normalizado. */
  textoExato: string;
  /** Até 100 chars antes do trecho. Desempata ocorrências repetidas. */
  prefixo: string;
  /** Até 100 chars depois do trecho. */
  sufixo: string;
  /** Offset / tamanho total do texto (0..1). */
  posicaoRelativa: number;
  /** id ou texto do <h2> mais próximo. Bônus de score, nunca filtro. */
  ancoraSecao: string | null;
}

export interface Comentario {
  id: string;
  threadId: string;
  corpo: string;
  tipo: TipoComentario;
  autorNome: string;
  autorUserId: string | null;
  editadoEm: string | null;
  criadoEm: string;
}

export interface Thread {
  id: string;
  documentoSlug: string;
  ancora: Ancora;
  /** documentos.atualizado_em quando a thread nasceu. Null em threads antigas. */
  docVersao: string | null;
  status: StatusThread;
  resolvidoPor: string | null;
  resolvidoEm: string | null;
  criadoPor: string;
  criadoEm: string;
  comentarios: Comentario[];
}

/** Tipo exibido para a thread: o do primeiro comentário. */
export function tipoDaThread(thread: Thread): TipoComentario {
  return thread.comentarios[0]?.tipo ?? "comentario";
}

/** True quando o documento foi regenerado depois de a thread nascer. */
export function documentoMudouDesde(
  thread: Thread,
  documentoAtualizadoEm: string
): boolean {
  if (!thread.docVersao) return false;
  return new Date(documentoAtualizadoEm) > new Date(thread.docVersao);
}

// ============================================
// Shapes crus do PostgREST (snake_case)
// ============================================

export interface ComentarioRow {
  id: string;
  thread_id: string;
  corpo: string;
  tipo: string;
  autor_nome: string;
  autor_user_id: string | null;
  editado_em: string | null;
  criado_em: string;
}

export interface ThreadRow {
  id: string;
  documento_slug: string;
  texto_exato: string;
  prefixo: string | null;
  sufixo: string | null;
  posicao_relativa: number | null;
  ancora_secao: string | null;
  doc_versao: string | null;
  status: string;
  resolvido_por: string | null;
  resolvido_em: string | null;
  criado_por: string;
  criado_em: string;
  documento_comentarios?: ComentarioRow[];
}

export function isTipoComentario(value: string): value is TipoComentario {
  return (
    value === "comentario" ||
    value === "duvida" ||
    value === "aprovacao" ||
    value === "reprovacao"
  );
}

export function toComentario(row: ComentarioRow): Comentario {
  return {
    id: row.id,
    threadId: row.thread_id,
    corpo: row.corpo,
    tipo: isTipoComentario(row.tipo) ? row.tipo : "comentario",
    autorNome: row.autor_nome,
    autorUserId: row.autor_user_id,
    editadoEm: row.editado_em,
    criadoEm: row.criado_em,
  };
}

export function toThread(row: ThreadRow): Thread {
  const comentarios = (row.documento_comentarios ?? [])
    .map(toComentario)
    .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm));

  return {
    id: row.id,
    documentoSlug: row.documento_slug,
    ancora: {
      textoExato: row.texto_exato,
      prefixo: row.prefixo ?? "",
      sufixo: row.sufixo ?? "",
      posicaoRelativa: row.posicao_relativa ?? 0,
      ancoraSecao: row.ancora_secao,
    },
    docVersao: row.doc_versao,
    status: row.status === "resolvido" ? "resolvido" : "aberto",
    resolvidoPor: row.resolvido_por,
    resolvidoEm: row.resolvido_em,
    criadoPor: row.criado_por,
    criadoEm: row.criado_em,
    comentarios,
  };
}
