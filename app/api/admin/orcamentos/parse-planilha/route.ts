import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { parsePlanilha } from "@/lib/orcamento-planilha"

export const dynamic = "force-dynamic"

const MAX_INPUT_BYTES = 5 * 1024 * 1024

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Campo 'file' ausente" },
      { status: 400 }
    )
  }
  if (file.size > MAX_INPUT_BYTES) {
    return NextResponse.json(
      { error: `Arquivo maior que ${MAX_INPUT_BYTES / 1024 / 1024}MB` },
      { status: 400 }
    )
  }

  const lower = file.name.toLowerCase()
  if (!lower.endsWith(".csv") && !lower.endsWith(".xlsx")) {
    return NextResponse.json(
      { error: "Formato não suportado. Use .csv ou .xlsx." },
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const resultado = await parsePlanilha(buffer, file.name)
  return NextResponse.json(resultado)
}
