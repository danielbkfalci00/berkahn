import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Debug: mostrar valores no console para diagnóstico
  if (typeof window !== 'undefined') {
    console.log('Supabase URL:', supabaseUrl?.substring(0, 30) + '...')
    console.log('Supabase Key exists:', !!supabaseKey && supabaseKey.length > 10)
  }

  // Validação robusta - verifica se são URLs/keys válidas
  if (!supabaseUrl || !supabaseKey ||
      supabaseUrl === 'undefined' || supabaseKey === 'undefined' ||
      !supabaseUrl.startsWith('https://')) {
    throw new Error(
      `Supabase não configurado. URL: ${supabaseUrl}, Key: ${supabaseKey ? 'presente' : 'ausente'}`
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
