import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { exigirSessao } from "@/lib/supabase/sessao"
import type { OrcamentoInsert } from "@/types/orcamento-estimativa"

export async function GET(request: Request) {
  const barrado = await exigirSessao()
  if (barrado) return barrado

  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const search = searchParams.get("q")

  let query = supabase
    .from("orcamentos")
    .select(
      "id, numero, status, cliente_nome, obra_cidade, projeto_area_m2, valor_min, valor_max, data_elaboracao, pdf_url, criado_em"
    )
    .order("criado_em", { ascending: false })

  if (status) query = query.eq("status", status)
  if (search) query = query.ilike("cliente_nome", `%${search}%`)

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const barrado = await exigirSessao()
  if (barrado) return barrado

  const supabase = await createClient()
  let body: Partial<OrcamentoInsert>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  if (!body.cliente_nome || !body.obra_endereco || !body.obra_cidade) {
    return NextResponse.json(
      { error: "cliente_nome, obra_endereco, obra_cidade são obrigatórios" },
      { status: 400 }
    )
  }

  const insertPayload = {
    ...body,
    status: body.status ?? "rascunho",
  }

  const { data, error } = await supabase
    .from("orcamentos")
    .insert(insertPayload)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 201 })
}
