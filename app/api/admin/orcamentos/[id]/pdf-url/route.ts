import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/admin"
import { exigirSessao } from "@/lib/supabase/sessao"
import { gerarSignedUrlPdf, getOrcamentoPdfState } from "@/lib/orcamento-pdf-storage"
import type { Orcamento } from "@/types/orcamento-estimativa"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, ctx: RouteContext) {
  // Devolve signed URL do PDF do cliente com service key: sem esta checagem,
  // qualquer um com um id na mão baixava o orçamento de qualquer cliente.
  const barrado = await exigirSessao()
  if (barrado) return barrado

  const { id } = await ctx.params

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("orcamentos")
    .select("*")
    .eq("id", id)
    .single()

  const storagePath = (data as { pdf_storage_path: string | null } | null)?.pdf_storage_path
  if (error || !storagePath) {
    return NextResponse.json(
      { error: "PDF ainda não gerado para este orçamento" },
      { status: 404 }
    )
  }
  const budget = data as unknown as Orcamento
  const pdfState = getOrcamentoPdfState(budget)
  if (pdfState === "stale") {
    return NextResponse.json({ error: "Este PDF é de uma versão anterior. Abra o orçamento e gere o PDF atualizado." }, { status: 409 })
  }

  try {
    const signedUrl = await gerarSignedUrlPdf(storagePath)
    return NextResponse.json({ pdf_url: signedUrl, verified: pdfState === "current" }, { headers: { "Cache-Control": "private, no-store" } })
  } catch (err) {
    return NextResponse.json(
      {
        error: "Falha ao gerar signed URL",
        details: err instanceof Error ? err.message : "Erro desconhecido",
      },
      { status: 500 }
    )
  }
}
