'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AnalyticsTask, TaskPriority } from '@/types/analytics'

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

/** Atualiza prioridade + sort_order em lote (drag-and-drop do Sprint 8). */
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
  revalidatePath('/admin/analytics')
  return { data: null, error: null }
}
