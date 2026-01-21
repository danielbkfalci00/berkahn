import { createClient } from '@/lib/supabase/server'

export type EntityType = 'post' | 'proposal' | 'presentation'

interface LogActivityParams {
  action: string
  entityType: EntityType
  entityId: string
  entityName: string
  details?: Record<string, unknown>
}

export async function logActivity({
  action,
  entityType,
  entityId,
  entityName,
  details,
}: LogActivityParams): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    const { error } = await supabase.from('activity_logs').insert({
      user_id: user.id,
      user_name: user.email || 'Admin',
      action,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName,
      details,
    })

    if (error) {
      console.error('Error logging activity:', error)
      return { error: error.message }
    }

    return { error: null }
  } catch (err) {
    console.error('Error in logActivity:', err)
    return { error: 'Failed to log activity' }
  }
}

export async function getRecentActivity(limit: number = 10) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching activity:', error)
      return { data: [], error: error.message }
    }

    return { data, error: null }
  } catch {
    return { data: [], error: 'Failed to fetch activity' }
  }
}
