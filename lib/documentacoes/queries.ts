// Queries server-side para a seção /admin/documentacoes
import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  isCategoriaDocumento,
  type DocumentoMeta,
  type DocumentoRow,
} from "@/types/documentacao";

// Colunas de metadado. Nunca inclui `html`: cada linha tem dezenas de KB e a
// listagem carregaria o acervo inteiro para renderizar títulos.
const COLUNAS_META =
  "slug, titulo, categoria, resumo, periodo_label, referencia_data, gerado_em, atualizado_em";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

function toMeta(row: DocumentoRow): DocumentoMeta {
  return {
    slug: row.slug,
    titulo: row.titulo,
    categoria: isCategoriaDocumento(row.categoria)
      ? row.categoria
      : "estrategia-editorial",
    resumo: row.resumo,
    periodoLabel: row.periodo_label,
    referenciaData: row.referencia_data,
    geradoEm: row.gerado_em,
    atualizadoEm: row.atualizado_em,
  };
}

/** Lista os documentos do mais recente ao mais antigo, sem o HTML. */
export async function listarDocumentos(): Promise<DocumentoMeta[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documentos")
    .select(COLUNAS_META)
    .order("referencia_data", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as DocumentoRow[]).map(toMeta);
}

/** Metadados de um documento. Retorna null se o slug não existir. */
export async function getDocumentoMeta(
  slug: string
): Promise<DocumentoMeta | null> {
  if (!SLUG_PATTERN.test(slug)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documentos")
    .select(COLUNAS_META)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return toMeta(data as unknown as DocumentoRow);
}

/**
 * HTML completo de um documento. Consumido apenas pela rota /raw, que o serve
 * dentro de um iframe.
 */
export async function getDocumentoHtml(slug: string): Promise<string | null> {
  if (!SLUG_PATTERN.test(slug)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documentos")
    .select("html")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return (data as { html: string }).html;
}
