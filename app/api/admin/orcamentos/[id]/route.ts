import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { exigirSessao } from "@/lib/supabase/sessao"
import { atualizarOrcamento, arquivarOrcamento, finalizarOrcamento } from "@/app/admin/orcamentos/actions"
import type { OrcamentoUpdate } from "@/types/orcamento-estimativa"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, ctx: RouteContext) {
  const barrado = await exigirSessao()
  if (barrado) return barrado

  const { id } = await ctx.params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orcamentos")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }
  return NextResponse.json({ data })
}

export async function PATCH(request: Request, ctx: RouteContext) {
  const barrado = await exigirSessao()
  if (barrado) return barrado

  const { id } = await ctx.params
  const supabase = await createClient()

  let body: OrcamentoUpdate
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const result = body?.status === "finalizado" ? await finalizarOrcamento(id, body) : await atualizarOrcamento(id, body)
  if (!result.ok) return NextResponse.json({ error: result.erro }, { status: 400 })
  const { data, error } = await supabase.from("orcamentos").select("*").eq("id", id).single()
  if (error) return NextResponse.json({ error: "Não foi possível reler o orçamento salvo" }, { status: 503 })
  return NextResponse.json({ data })
}

export async function DELETE(_: Request, ctx: RouteContext) {
  const barrado = await exigirSessao()
  if (barrado) return barrado

  const { id } = await ctx.params
  const result = await arquivarOrcamento(id)
  if (!result.ok) return NextResponse.json({ error: result.erro }, { status: 400 })
  return NextResponse.json({ data: { id, status: "arquivado" } })
}
