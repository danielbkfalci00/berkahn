import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/admin"
import { exigirSessao } from "@/lib/supabase/sessao"
import { gerarSignedUrlPdf } from "@/lib/orcamento-pdf-storage"

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
    .select("pdf_storage_path")
    .eq("id", id)
    .single()

  const storagePath = (data as { pdf_storage_path: string | null } | null)?.pdf_storage_path
  if (error || !storagePath) {
    return NextResponse.json(
      { error: "PDF ainda não gerado para este orçamento" },
      { status: 404 }
    )
  }

  try {
    const signedUrl = await gerarSignedUrlPdf(storagePath)
    await supabase
      .from("orcamentos")
      .update({ pdf_url: signedUrl })
      .eq("id", id)
    return NextResponse.json({ pdf_url: signedUrl })
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
