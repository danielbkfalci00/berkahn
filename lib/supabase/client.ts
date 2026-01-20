import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Debug fetch wrapper para identificar valores inválidos
function debugFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (typeof window !== 'undefined') {
    console.log('=== FETCH DEBUG ===')
    console.log('URL:', typeof input === 'string' ? input : input.toString())
    console.log('Method:', init?.method || 'GET')

    // Verificar headers por valores inválidos
    if (init?.headers) {
      const headers = init.headers as Record<string, string>
      console.log('Headers:')
      for (const [key, value] of Object.entries(headers)) {
        const isValid = typeof value === 'string' && value !== 'undefined' && value !== 'null'
        console.log(`  ${key}: ${value} (${isValid ? 'OK' : 'INVALID!'})`)
        if (!isValid) {
          console.error(`INVALID HEADER VALUE: ${key} = ${value}`)
        }
      }
    }

    // Verificar body
    if (init?.body) {
      console.log('Body type:', typeof init.body)
      console.log('Body:', init.body)
    }
    console.log('===================')
  }

  return fetch(input, init)
}

export function createClient() {
  // IMPORTANTE: Limpar whitespace e newlines das env vars
  // A key pode ter \n se foi copiada incorretamente no Vercel
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/[\r\n]/g, '')
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/[\r\n]/g, '')

  // Debug: mostrar valores no console para diagnóstico
  if (typeof window !== 'undefined') {
    console.log('Supabase URL:', supabaseUrl?.substring(0, 30) + '...')
    console.log('Supabase Key exists:', !!supabaseKey && supabaseKey.length > 10)
    console.log('Supabase Key length:', supabaseKey?.length)
    // Verificar se tinha newline
    const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (originalKey && originalKey.includes('\n')) {
      console.warn('WARNING: Supabase key contained newline character - this was cleaned')
    }
  }

  // Validação robusta - verifica se são URLs/keys válidas
  if (!supabaseUrl || !supabaseKey ||
      supabaseUrl === 'undefined' || supabaseKey === 'undefined' ||
      !supabaseUrl.startsWith('https://')) {
    throw new Error(
      `Supabase não configurado. URL: ${supabaseUrl}, Key: ${supabaseKey ? 'presente' : 'ausente'}`
    )
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      fetch: debugFetch,
    }
  })
}
