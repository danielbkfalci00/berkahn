import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { roleCanAccessPath } from '@/lib/admin/access'
import type { AdminRole } from '@/types/analytics'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Limpar whitespace e newlines das env vars por segurança
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/[\r\n]/g, '') || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/[\r\n]/g, '') || ''

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isPasswordPage = request.nextUrl.pathname === '/admin/definir-senha'
  const isAdminApi = request.nextUrl.pathname.startsWith('/api/admin')

  // API responde 401, nunca redirect: um 302 para /admin/login vira, dentro de
  // um fetch(), uma resposta 200 com HTML de tela de login — que o cliente lê
  // como sucesso e tenta parsear como JSON. O status tem que dizer a verdade.
  if (isAdminApi && !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  if (isAdminRoute && !isLoginPage && !user) {
    // Redirect to login if not authenticated
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  let membership: { role: AdminRole } | null = null
  if (user && (isAdminRoute || isAdminApi)) {
    const { data } = await supabase
      .from('lead_responsaveis')
      .select('role')
      .eq('user_id', user.id)
      .eq('ativo', true)
      .maybeSingle()
    membership = data as { role: AdminRole } | null
  }

  if (isAdminApi && user && !membership) {
    return NextResponse.json({ error: 'Acesso administrativo inativo' }, { status: 403 })
  }

  if (isAdminRoute && !isLoginPage && user && !membership) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('erro', 'acesso-inativo')
    return NextResponse.redirect(url)
  }

  if (isAdminRoute && !isLoginPage && !isPasswordPage && membership && !roleCanAccessPath(membership.role, request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (isLoginPage && user && membership) {
    // Redirect to dashboard if already authenticated
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
