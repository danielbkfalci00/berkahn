import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Limpar whitespace e newlines das env vars por segurança
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/[\r\n]/g, '')
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/[\r\n]/g, '')

  // Validação robusta
  if (!supabaseUrl || !supabaseKey ||
      supabaseUrl === 'undefined' || supabaseKey === 'undefined' ||
      !supabaseUrl.startsWith('https://')) {
    throw new Error(
      `Supabase não configurado. URL: ${supabaseUrl}, Key: ${supabaseKey ? 'presente' : 'ausente'}`
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
