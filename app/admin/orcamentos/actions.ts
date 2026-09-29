"use server"

import { revalidatePath } from "next/cache"
import { getAdminSession } from "@/lib/supabase/sessao"
import { initialState, validarTudo } from "@/components/admin/orcamentos/wizard-state"
import { rowParaInsert } from "@/lib/orcamento-planilha"
import type {
  OrcamentoInsert,
  OrcamentoUpdate,
  PlanilhaOrcamentoRow,
} from "@/types/orcamento-estimativa"

type ActionResultCreate =
  | { ok: true; id: string; numero: string; atualizadoEm: string }
  | { ok: false; erro: string }

type ActionResultUpdate = { ok: true; atualizadoEm: string } | { ok: false; erro: string; conflito?: boolean }

function revisionError(revision: unknown): ActionResultUpdate | null {
  return typeof revision === "string" && /^\d{4}-\d{2}-\d{2}T/.test(revision) && Number.isFinite(Date.parse(revision))
    ? null
    : { ok: false, conflito: true, erro: "A versão do orçamento não foi informada. Abra a versão atual antes de salvar." }
}

function revisionConflict(): ActionResultUpdate {
  return { ok: false, conflito: true, erro: "Este orçamento mudou em outra aba ou por outra pessoa. Suas alterações continuam neste formulário. Confira a versão atual antes de editar novamente." }
}

async function getAuthorizedAdmin() {
  const admin = await getAdminSession()
  return admin && ["owner", "comercial"].includes(admin.membership.role) ? admin : null
}

// Impede que payloads do cliente sobrescrevam URLs, autoria ou campos de revisão.
function editablePatch(input: OrcamentoUpdate): OrcamentoUpdate {
  const protectedFields = new Set(["id", "numero", "slug", "criado_em", "atualizado_em", "criado_por", "pdf_url", "pdf_storage_path", "pdf_generated_at", "pdf_revision_hash"])
  const allowed = new Set(Object.keys(initialState().dados))
  return Object.fromEntries(Object.entries(input).filter(([key]) => allowed.has(key) && !protectedFields.has(key))) as OrcamentoUpdate
}

function budgetPatchError(input: unknown): string | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return "Dados de orçamento inválidos."
  const values = input as Record<string, unknown>
  const numeric = ["projeto_area_m2", "projeto_pavimentos", "valor_min", "valor_max", "valor_m2_min", "valor_m2_max", "validade_dias"]
  for (const key of numeric) if (key in values && (typeof values[key] !== "number" || !Number.isFinite(values[key]) || Number(values[key]) < 0)) return `Valor inválido: ${key}.`
  const strings = ["cliente_nome", "cliente_email", "cliente_telefone", "obra_endereco", "obra_cidade", "obra_referencia", "projeto_piscina", "responsavel_tecnico"]
  for (const key of strings) if (values[key] != null && (typeof values[key] !== "string" || String(values[key]).length > 500)) return `Texto inválido: ${key}.`
  if (values.cliente_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.cliente_email))) return "Email inválido."
  for (const key of ["data_cotacao", "data_elaboracao"]) if (key in values && (typeof values[key] !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(String(values[key])) || !Number.isFinite(Date.parse(String(values[key]))))) return "Data inválida."
  if (values.lead_id != null && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(values.lead_id))) return "Lead inválido."
  for (const key of ["condicionantes_extras", "exclusoes_extras"]) {
    if (key in values && (!Array.isArray(values[key]) || (values[key] as unknown[]).length > 100 || !(values[key] as unknown[]).every((item) => item && typeof item === "object" && typeof (item as { texto?: unknown }).texto === "string"))) return "Lista de condições inválida."
  }
  if ("entrega_categorias_ativas" in values && (!Array.isArray(values.entrega_categorias_ativas) || !values.entrega_categorias_ativas.every((value) => typeof value === "string"))) return "Lista de entregas inválida."
  return null
}

function revalidateBudget(id?: string, leadId?: string | null) {
  revalidatePath("/admin/orcamentos")
  revalidatePath("/admin/leads")
  if (id) revalidatePath(`/admin/orcamentos/${id}`)
  if (leadId) revalidatePath(`/admin/leads/${leadId}`)
}

export async function criarOrcamento(
  input: OrcamentoInsert
): Promise<ActionResultCreate> {
  const admin = await getAuthorizedAdmin()
  if (!admin) return { ok: false, erro: "Não autorizado" }

  const inputError = budgetPatchError(input)
  if (inputError) return { ok: false, erro: inputError }

  const supabase = admin.supabase
  // Cast: JSONB columns (condicionantes_extras, exclusoes_extras, entrega_categorias_ativas)
  // tipam como Json no Database gerado, mas mantemos shapes específicos no domínio.
  const clean = { ...initialState().dados, ...editablePatch(input), criado_por: admin.user.id, status: "rascunho" }
  const payload = clean as never
  const { data, error } = await supabase
    .from("orcamentos")
    .insert(payload)
    .select("id, numero, atualizado_em")
    .single()

  if (error || !data) {
    return { ok: false, erro: error?.message ?? "Falha ao criar orçamento" }
  }
  const row = data as { id: string; numero: string; atualizado_em: string }
  revalidateBudget(row.id, clean.lead_id)
  return { ok: true, id: row.id, numero: row.numero, atualizadoEm: row.atualizado_em }
}

export async function searchBudgetLeads(rawQuery: string): Promise<Array<{ id: string; nome: string; email: string | null; telefone: string | null }>> {
  const admin = await getAuthorizedAdmin()
  if (!admin) return []
  const query = rawQuery.trim().replace(/[,()%]/g, " ").slice(0, 120)
  if (query.length < 2) return []
  const { data, error } = await admin.supabase.from("leads")
    .select("id,nome,email,telefone").is("anonimizado_em", null)
    .or(`nome.ilike.%${query}%,email.ilike.%${query}%,telefone.ilike.%${query}%`)
    .order("criado_em", { ascending: false }).limit(10)
  if (error) throw new Error("Não foi possível buscar os leads. Tente novamente.")
  return data || []
}

export async function atualizarOrcamento(
  id: string,
  patch: OrcamentoUpdate,
  atualizadoEm: string
): Promise<ActionResultUpdate> {
  const admin = await getAuthorizedAdmin()
  if (!admin) return { ok: false, erro: "Não autorizado" }
  const inputError = budgetPatchError(patch)
  if (inputError) return { ok: false, erro: inputError }
  const invalidRevision = revisionError(atualizadoEm)
  if (invalidRevision) return invalidRevision
  if (patch.status === "finalizado") return finalizarOrcamento(id, patch, atualizadoEm)

  const supabase = admin.supabase
  const { data, error } = await supabase
    .from("orcamentos")
    .update(editablePatch(patch) as never)
    .eq("id", id)
    .eq("atualizado_em", atualizadoEm)
    .select("id,lead_id,atualizado_em")
    .maybeSingle()

  if (error) {
    return { ok: false, erro: error.message }
  }
  if (!data) return revisionConflict()
  revalidateBudget(id, data.lead_id)
  return { ok: true, atualizadoEm: data.atualizado_em }
}

export async function criarRascunhoDePlanilha(
  row: PlanilhaOrcamentoRow
): Promise<ActionResultCreate> {
  const insert = rowParaInsert(row)
  return criarOrcamento(insert)
}

export async function arquivarOrcamento(
  id: string,
  atualizadoEm: string
): Promise<ActionResultUpdate> {
  return atualizarOrcamento(id, { status: "arquivado" }, atualizadoEm)
}

export async function desarquivarOrcamento(
  id: string,
  atualizadoEm: string
): Promise<ActionResultUpdate> {
  return atualizarOrcamento(id, { status: "rascunho" }, atualizadoEm)
}

export async function finalizarOrcamento(
  id: string,
  patch: OrcamentoUpdate,
  atualizadoEm: string
): Promise<ActionResultUpdate> {
  const admin = await getAuthorizedAdmin()
  if (!admin) return { ok: false, erro: "Não autorizado" }
  const inputError = budgetPatchError(patch)
  if (inputError) return { ok: false, erro: inputError }
  const invalidRevision = revisionError(atualizadoEm)
  if (invalidRevision) return invalidRevision

  const supabase = admin.supabase
  const { data: current, error: readError } = await supabase.from("orcamentos").select("*").eq("id", id).eq("atualizado_em", atualizadoEm).maybeSingle()
  if (readError) return { ok: false, erro: "Não foi possível consultar o orçamento. Tente novamente." }
  if (!current) return revisionConflict()
  const clean = editablePatch(patch)
  const validation = validarTudo({ ...current, ...clean } as OrcamentoInsert)
  if (!validation.ok) return { ok: false, erro: Object.values(validation.erros).join(". ") }
  const { data: budget, error } = await supabase
    .from("orcamentos")
    .update({ ...clean, status: "finalizado" } as never)
    .eq("id", id)
    .eq("atualizado_em", atualizadoEm)
    .select("lead_id,atualizado_em")
    .maybeSingle()

  if (error) {
    return { ok: false, erro: error.message }
  }
  if (!budget) return revisionConflict()
  if (budget.lead_id && current.status !== "finalizado") {
    const { error: logError } = await admin.supabase.from("activity_logs").insert({
      user_id: admin.user.id,
      user_name: admin.user.email || "Admin",
      action: "Orçamento finalizado",
      entity_type: "lead",
      entity_id: budget.lead_id,
      entity_name: `Lead ${budget.lead_id.slice(0, 8)}`,
      details: { tipo: "orcamento_finalizado", orcamento_id: id },
    })
    if (logError) console.error("lead budget activity:", logError.message)
    revalidatePath(`/admin/leads/${budget.lead_id}`)
  }
  revalidateBudget(id, budget?.lead_id)
  return { ok: true, atualizadoEm: budget.atualizado_em }
}
