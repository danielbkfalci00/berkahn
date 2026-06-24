"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/admin"
import type {
  OrcamentoInsert,
  OrcamentoUpdate,
} from "@/types/orcamento-estimativa"

type ActionResultCreate =
  | { ok: true; id: string; numero: string }
  | { ok: false; erro: string }

type ActionResultUpdate = { ok: true } | { ok: false; erro: string }

export async function criarOrcamento(
  input: OrcamentoInsert
): Promise<ActionResultCreate> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("orcamentos")
    // @ts-expect-error supabase-js v2.90 não infere bem o Insert genérico — fixar quando regenerar Database type via supabase gen
    .insert({ ...input, status: input.status ?? "rascunho" })
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
    // @ts-expect-error supabase-js v2.90 não infere bem o Update genérico — fixar quando regenerar Database type via supabase gen
    .update(patch)
    .eq("id", id)

  if (error) {
    return { ok: false, erro: error.message }
  }
  revalidatePath("/admin/orcamentos")
  revalidatePath(`/admin/orcamentos/${id}`)
  return { ok: true }
}

export async function finalizarOrcamento(
  id: string,
  patch: OrcamentoUpdate
): Promise<ActionResultUpdate> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from("orcamentos")
    // @ts-expect-error supabase-js v2.90 não infere bem o Update genérico — fixar quando regenerar Database type via supabase gen
    .update({ ...patch, status: "finalizado" })
    .eq("id", id)

  if (error) {
    return { ok: false, erro: error.message }
  }
  revalidatePath("/admin/orcamentos")
  revalidatePath(`/admin/orcamentos/${id}`)
  return { ok: true }
}
