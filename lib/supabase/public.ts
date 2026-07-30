import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase-db'

// Cliente de leitura pública, sem cookies.
//
// Por que não usar lib/supabase/server.ts aqui: ele chama `await cookies()`,
// o que opta a rota inteira por renderização dinâmica. Isso matava o ISR de
// /atualidades — `revalidate = 60` e `generateStaticParams` viravam código
// morto, e toda visita ao artigo respondia `no-store` com round-trip ao banco.
//
// Use este cliente em qualquer leitura pública que não dependa de sessão
// (artigos, sitemap, feed). Para /admin continue usando o de server.ts: lá o
// cookie É a autenticação.

let cached: SupabaseClient<Database> | null = null

// Mesmo saneamento de lib/supabase/admin.ts: env vars coladas do dashboard
// vêm com whitespace/newline invisível e o fetch do Node rejeita headers com \n.
function sanitizeEnv(v: string | undefined): string | undefined {
  return v?.trim().replace(/[\r\n]/g, '') || undefined
}

export function createPublicClient(): SupabaseClient<Database> {
  if (cached) return cached

  const url = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const anonKey = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL ausente no env')
  }
  if (!anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY ausente no env')
  }

  // Sem persistência de sessão: este cliente é sempre anônimo e é
  // compartilhado entre requests. RLS continua valendo.
  cached = createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}
