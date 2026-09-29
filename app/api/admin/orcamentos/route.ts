import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { exigirSessao } from "@/lib/supabase/sessao"
import { criarOrcamento } from "@/app/admin/orcamentos/actions"
import type { OrcamentoInsert } from "@/types/orcamento-estimativa"

export async function GET(request: Request) {
  const barrado = await exigirSessao()
  if (barrado) return barrado

  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const search = searchParams.get("q")?.trim().slice(0, 120)
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("pageSize") || "25", 10) || 25))

  let query = supabase
    .from("orcamentos")
    .select(
      "id, numero, status, cliente_nome, obra_cidade, projeto_area_m2, valor_min, valor_max, data_elaboracao, pdf_url, pdf_storage_path, pdf_generated_at, criado_em", { count: "exact" }
    )
    .order("criado_em", { ascending: false }).order("id").range((page - 1) * pageSize, page * pageSize - 1)

  if (status) query = query.eq("status", status)
  if (search) query = query.ilike("cliente_nome", `%${search}%`)

  const { data, error, count } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data, total: count, page, pageSize })
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

  if (!body || typeof body !== "object" || !body.cliente_nome || !body.obra_endereco || !body.obra_cidade) {
    return NextResponse.json(
      { error: "cliente_nome, obra_endereco, obra_cidade são obrigatórios" },
      { status: 400 }
    )
  }

  const result = await criarOrcamento(body as OrcamentoInsert)
  if (!result.ok) return NextResponse.json({ error: result.erro }, { status: 400 })
  const { data } = await supabase.from("orcamentos").select("*").eq("id", result.id).single()
  return NextResponse.json({ data }, { status: 201 })
}
