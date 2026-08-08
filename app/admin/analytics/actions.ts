'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AnalyticsTask, LeadStatus, TaskPriority } from '@/types/analytics'

type ActionResult<T = null> = { data: T; error: string | null }

/**
 * Cria uma tarefa. Quando promovida de uma sugestão do sistema, passar
 * `origin_signal` = texto da sugestão (usado para dedup na zona "Recomendado").
 */
export async function createTask(input: {
  title: string
  description?: string | null
  priority?: TaskPriority
  source?: 'system' | 'manual'
  origin_signal?: string | null
  pauta_id?: string | null
  evidencias?: Record<string, unknown> | null
}): Promise<ActionResult<AnalyticsTask | null>> {
  const title = input.title?.trim()
  if (!title) return { data: null, error: 'Título obrigatório.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // sort_order: coloca no fim da lista
  const { data: maxRow } = await supabase
    .from('analytics_tasks')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()
  const nextOrder = (maxRow?.sort_order ?? 0) + 1

  const { data, error } = await supabase
    .from('analytics_tasks')
    .insert({
      title,
      description: input.description ?? null,
      priority: input.priority ?? 'p1',
      source: input.source ?? 'manual',
      origin_signal: input.origin_signal ?? null,
      pauta_id: input.pauta_id ?? null,
      evidence: input.evidencias ?? {},
      approval_status: input.source === 'system' ? 'pendente' : 'aprovada',
      sort_order: nextOrder,
      created_by: user?.email ?? null,
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  if (user && data) {
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      user_name: user.email || 'Admin',
      action: 'Tarefa criada',
      entity_type: 'task',
      entity_id: data.id,
      entity_name: data.title,
    })
  }
  revalidatePath('/admin/analytics')
  return { data: data as AnalyticsTask, error: null }
}

export async function updateTask(
  id: string,
  patch: { title?: string; description?: string | null; priority?: TaskPriority }
): Promise<ActionResult<AnalyticsTask | null>> {
  const supabase = await createClient()
  const update: Record<string, unknown> = {}
  if (patch.title !== undefined) update.title = patch.title.trim()
  if (patch.description !== undefined) update.description = patch.description
  if (patch.priority !== undefined) update.priority = patch.priority

  if (Object.keys(update).length === 0) {
    return { data: null, error: 'Nada para atualizar.' }
  }

  const { data, error } = await supabase
    .from('analytics_tasks')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  revalidatePath('/admin/analytics')
  return { data: data as AnalyticsTask, error: null }
}

export async function completeTask(id: string, note?: string): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('analytics_tasks')
    .update({
      status: 'done',
      completion_note: note?.trim() || null,
      completed_by: user?.email ?? null,
      completed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  if (user && data) {
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      user_name: user.email || 'Admin',
      action: 'Tarefa concluída',
      entity_type: 'task',
      entity_id: data.id,
      entity_name: data.title,
      details: note?.trim() ? { note: note.trim() } : null,
    })
  }
  revalidatePath('/admin/analytics')
  return { data: null, error: null }
}

export async function reopenTask(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('analytics_tasks')
    .update({
      status: 'open',
      completion_note: null,
      completed_by: null,
      completed_at: null,
    })
    .eq('id', id)

  if (error) return { data: null, error: error.message }
  revalidatePath('/admin/analytics')
  return { data: null, error: null }
}

export async function deleteTask(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('analytics_tasks').delete().eq('id', id)
  if (error) return { data: null, error: error.message }
  revalidatePath('/admin/analytics')
  return { data: null, error: null }
}

/**
 * Atualiza prioridade + sort_order em lote (drag-and-drop do Sprint 8).
 * Sem revalidatePath de propósito: a UI fica coberta pelo estado otimista local
 * do TaskBoard; revalidar a cada solta re-buscaria a página inteira (snapshot +
 * posts + trend) e causaria flicker. A ordem persiste e é relida no próximo fetch.
 */
export async function reorderTasks(
  updates: { id: string; sort_order: number; priority: TaskPriority }[]
): Promise<ActionResult> {
  const supabase = await createClient()
  for (const u of updates) {
    const { error } = await supabase
      .from('analytics_tasks')
      .update({ sort_order: u.sort_order, priority: u.priority })
      .eq('id', u.id)
    if (error) return { data: null, error: error.message }
  }
  return { data: null, error: null }
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Sessão expirada.' }

  const qualified = status === 'qualificado' || status === 'convertido'
  const { data, error } = await supabase
    .from('leads')
    .update({
      status,
      qualificado_por: qualified ? user.id : null,
      qualificado_em: qualified ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select('id,nome')
    .single()

  if (error) return { data: null, error: error.message }
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    user_name: user.email || 'Admin',
    action: 'Status do lead alterado',
    entity_type: 'lead',
    entity_id: data.id,
    entity_name: data.nome,
    details: { status },
  })
  revalidatePath('/admin/analytics')
  return { data: null, error: null }
}

export async function retryLeadSheetSync(id: string): Promise<ActionResult> {
  const endpoint = process.env.GOOGLE_SHEETS_LEAD_ENDPOINT?.trim()
  const syncSecret = process.env.GOOGLE_SHEETS_LEAD_SECRET?.trim()
  if (!endpoint) return { data: null, error: 'GOOGLE_SHEETS_LEAD_ENDPOINT não configurado.' }
  if (!syncSecret) return { data: null, error: 'GOOGLE_SHEETS_LEAD_SECRET não configurado.' }

  const supabase = await createClient()
  const { data: lead, error } = await supabase
    .from('leads')
    .select('id,nome,email,telefone,segmento,mensagem,pagina_origem,pauta_id,status,sheet_sync_tentativas')
    .eq('id', id)
    .single()
  if (error || !lead) return { data: null, error: error?.message || 'Lead não encontrado.' }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        sync_secret: syncSecret,
        lead_id: lead.id,
        name: lead.nome,
        email: lead.email ?? '',
        phone: lead.telefone,
        segmento: lead.segmento,
        origem: lead.pagina_origem ?? '',
        pauta: lead.pauta_id ?? '',
        status: lead.status,
        message: lead.mensagem,
      }),
      signal: AbortSignal.timeout(8_000),
    })
    const sheetResult = await response.json().catch(() => null) as
      | { success?: boolean; message?: string }
      | null
    if (!response.ok || sheetResult?.success !== true) {
      throw new Error(sheetResult?.message || `HTTP ${response.status}`)
    }
    await supabase
      .from('leads')
      .update({
        sheet_sync_status: 'sincronizado',
        sheet_sync_tentativas: lead.sheet_sync_tentativas + 1,
        sheet_synced_at: new Date().toISOString(),
        sheet_sync_error: null,
      })
      .eq('id', id)
  } catch (syncError) {
    const message =
      syncError instanceof Error ? syncError.message.slice(0, 500) : 'Falha desconhecida'
    await supabase
      .from('leads')
      .update({
        sheet_sync_status: 'falhou',
        sheet_sync_tentativas: lead.sheet_sync_tentativas + 1,
        sheet_sync_error: message,
      })
      .eq('id', id)
    revalidatePath('/admin/analytics')
    return { data: null, error: message }
  }

  revalidatePath('/admin/analytics')
  return { data: null, error: null }
}
