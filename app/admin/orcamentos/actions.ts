"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/admin"
import { rowParaInsert } from "@/lib/orcamento-planilha"
import type {
  OrcamentoInsert,
  OrcamentoUpdate,
  PlanilhaOrcamentoRow,
} from "@/types/orcamento-estimativa"

type ActionResultCreate =
  | { ok: true; id: string; numero: string }
  | { ok: false; erro: string }

type ActionResultUpdate = { ok: true } | { ok: false; erro: string }

export async function criarOrcamento(
  input: OrcamentoInsert
): Promise<ActionResultCreate> {
  const supabase = createServiceClient()
  // Cast: JSONB columns (condicionantes_extras, exclusoes_extras, entrega_categorias_ativas)
  // tipam como Json no Database gerado, mas mantemos shapes específicos no domínio.
  const payload = { ...input, status: input.status ?? "rascunho" } as never
  const { data, error } = await supabase
    .from("orcamentos")
    .insert(payload)
    .select("id, numero")
    .single()

  if (error || !data) {
    return { ok: false, erro: error?.message ?? "Falha ao criar orçamento" }
  }
  const row = data as { id: string; numero: string }
  revalidatePath("/admin/orcamentos")
  return { ok: true, id: row.id, numero: row.numero }
}

export async function atualizarOrcamento(
  id: string,
  patch: OrcamentoUpdate
): Promise<ActionResultUpdate> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from("orcamentos")
    .update(patch as never)
    .eq("id", id)

  if (error) {
    return { ok: false, erro: error.message }
  }
  revalidatePath("/admin/orcamentos")
  revalidatePath(`/admin/orcamentos/${id}`)
  return { ok: true }
}

export async function criarRascunhoDePlanilha(
  row: PlanilhaOrcamentoRow
): Promise<ActionResultCreate> {
  const insert = rowParaInsert(row)
  return criarOrcamento(insert)
}

export async function arquivarOrcamento(
  id: string
): Promise<ActionResultUpdate> {
  return atualizarOrcamento(id, { status: "arquivado" })
}

export async function desarquivarOrcamento(
  id: string
): Promise<ActionResultUpdate> {
  return atualizarOrcamento(id, { status: "rascunho" })
}

export async function finalizarOrcamento(
  id: string,
  patch: OrcamentoUpdate
): Promise<ActionResultUpdate> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from("orcamentos")
    .update({ ...patch, status: "finalizado" } as never)
    .eq("id", id)

  if (error) {
    return { ok: false, erro: error.message }
  }
  revalidatePath("/admin/orcamentos")
  revalidatePath(`/admin/orcamentos/${id}`)
  return { ok: true }
}
