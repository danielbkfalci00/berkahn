// Tipos da seção /admin/documentacoes
// Tabela: documentos (supabase/migrations/008_documentacoes.sql)

export type CategoriaDocumento = "performance-mensal" | "estrategia-editorial";

export const CATEGORIA_LABEL: Record<CategoriaDocumento, string> = {
  "performance-mensal": "Performance",
  "estrategia-editorial": "Estratégia",
};

/**
 * Metadados de um documento, sem o HTML.
 * Usado na listagem — o HTML tem dezenas de KB por linha e nunca deve
 * trafegar numa query de lista.
 */
export interface DocumentoMeta {
  slug: string;
  titulo: string;
  categoria: CategoriaDocumento;
  resumo: string | null;
  periodoLabel: string | null;
  referenciaData: string; // "YYYY-MM-DD"
  geradoEm: string; // ISO
  atualizadoEm: string; // ISO
}

/** Documento completo. Só a rota /raw carrega isto. */
export interface DocumentoConteudo extends DocumentoMeta {
  html: string;
}

/** Shape cru vindo do PostgREST (snake_case). */
export interface DocumentoRow {
  slug: string;
  titulo: string;
  categoria: string;
  resumo: string | null;
  periodo_label: string | null;
  referencia_data: string;
  gerado_em: string;
  atualizado_em: string;
}

export function isCategoriaDocumento(value: string): value is CategoriaDocumento {
  return value === "performance-mensal" || value === "estrategia-editorial";
}
