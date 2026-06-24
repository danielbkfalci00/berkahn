import { createServiceClient } from '@/lib/supabase/admin'

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
  return `${year}/${month}/${numero}.pdf`
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

  const { data, error: signedError } = await supabase.storage
    .from(BUCKET_PDFS)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS)

  if (signedError || !data) {
    throw new Error(`Falha ao gerar signed URL: ${signedError?.message ?? 'sem dados'}`)
  }

  return { path, signedUrl: data.signedUrl }
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
