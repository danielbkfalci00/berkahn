import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase-db'

let cached: SupabaseClient<Database> | null = null

// Sanitiza env vars que vêm coladas do dashboard Vercel/Supabase com
// whitespace ou newlines invisíveis no final — Node fetch rejeita
// headers com \n. Mesmo padrão do lib/supabase/middleware.ts.
function sanitizeEnv(v: string | undefined): string | undefined {
  return v?.trim().replace(/[\r\n]/g, "") || undefined
}

export function createServiceClient(): SupabaseClient<Database> {
  if (cached) return cached
  const url = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)
  // Aceita ambos: SUPABASE_SERVICE_KEY (legado deste projeto) e
  // SUPABASE_SERVICE_ROLE_KEY (padrão Supabase docs / .env.local local).
  const serviceKey =
    sanitizeEnv(process.env.SUPABASE_SERVICE_KEY) ||
    sanitizeEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL ausente no env (server-side)')
  }
  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_KEY (ou SUPABASE_SERVICE_ROLE_KEY) ausente no env (server-side). Configure no Vercel Settings > Environment Variables.'
    )
  }
  cached = createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}
