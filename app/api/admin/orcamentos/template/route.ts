import { NextResponse } from "next/server"
import { gerarTemplateXlsx } from "@/lib/orcamento-template-xlsx"
import { exigirSessao } from "@/lib/supabase/sessao"

export const dynamic = "force-dynamic"

export async function GET() {
  const barrado = await exigirSessao()
  if (barrado) return barrado

  try {
    const buffer = await gerarTemplateXlsx()
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="modelo-orcamento.xlsx"',
        "Cache-Control": "public, max-age=86400, immutable",
      },
    })
  } catch (err) {
    console.error("Falha ao gerar template:", err)
    return NextResponse.json(
      { error: "Falha ao gerar template" },
      { status: 500 }
    )
  }
}
