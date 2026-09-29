import 'server-only'
import { createHash, randomUUID } from 'node:crypto'
import { createServiceClient } from '@/lib/supabase/admin'
import type { Orcamento } from '@/types/orcamento-estimativa'

// Ordem estável, somente campos usados no documento; renovar uma URL não muda a revisão.
const DOCUMENT_FIELDS = [
  'numero', 'cliente_nome', 'cliente_email', 'cliente_telefone', 'obra_endereco',
  'obra_cidade', 'obra_referencia', 'projeto_area_m2', 'projeto_pavimentos',
  'projeto_piscina', 'projeto_padrao', 'valor_min', 'valor_max', 'valor_m2_min',
  'valor_m2_max', 'regime_recomendado', 'data_cotacao', 'data_elaboracao',
  'validade_dias', 'hero_image_url', 'condicionantes_extras', 'exclusoes_extras',
  'entrega_categorias_ativas', 'responsavel_tecnico',
] as const satisfies readonly (keyof Orcamento)[]

export function getOrcamentoPdfRevision(orcamento: Orcamento): string {
  return createHash('sha256').update(JSON.stringify(DOCUMENT_FIELDS.map((field) => orcamento[field] ?? null))).digest('hex')
}

export function isOrcamentoPdfCurrent(orcamento: Orcamento): boolean {
  return Boolean(orcamento.pdf_storage_path && orcamento.pdf_revision_hash === getOrcamentoPdfRevision(orcamento))
}

const BUCKET_PDFS = 'orcamento-pdfs'
const SIGNED_URL_TTL_SECONDS = 7 * 24 * 60 * 60

export interface SavedPdf {
  path: string
  signedUrl: string
}

function buildPdfPath(numero: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}/${month}/${numero}-${randomUUID()}.pdf`
}

export async function salvarPdfOrcamento(
  numero: string,
  pdfBuffer: Buffer
): Promise<SavedPdf> {
  const supabase = createServiceClient()
  const path = buildPdfPath(numero)

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_PDFS)
    .upload(path, pdfBuffer, {
      contentType: 'application/pdf',
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) {
    throw new Error(`Falha ao subir PDF: ${uploadError.message}`)
  }

  try {
    const { data, error: signedError } = await supabase.storage
      .from(BUCKET_PDFS)
      .createSignedUrl(path, SIGNED_URL_TTL_SECONDS)
    if (signedError || !data?.signedUrl) {
      throw new Error(`Falha ao gerar signed URL: ${signedError?.message ?? 'sem dados'}`)
    }
    return { path, signedUrl: data.signedUrl }
  } catch (error) {
    const cleanup = await supabase.storage.from(BUCKET_PDFS).remove([path]).catch(() => null)
    if (!cleanup || cleanup.error) console.error('Falha ao limpar PDF sem URL assinada')
    throw error
  }
}

export async function gerarSignedUrlPdf(path: string): Promise<string> {
  const supabase = createServiceClient()
  const { data, error } = await supabase.storage
    .from(BUCKET_PDFS)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS)
  if (error || !data) {
    throw new Error(`Falha ao gerar signed URL: ${error?.message ?? 'sem dados'}`)
  }
  return data.signedUrl
}
