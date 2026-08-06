import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Redirect root to /admin when accessing via admin subdomain
  if (hostname.startsWith('admin.') && pathname === '/') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Handle auth session for admin routes (páginas e API)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    return await updateSession(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match admin routes and root path for subdomain redirect.
     *
     * `/api/admin/:path*` NÃO estava aqui, e por isso seis route handlers de
     * orçamentos ficaram sem nenhuma checagem de sessão — três deles usando
     * service key, que bypassa RLS. Dava para listar, alterar e apagar
     * orçamentos, e pegar signed URL do PDF do cliente, sem login.
     *
     * As rotas públicas por desenho (/api/orcamento/**, /api/institucional/**)
     * seguem fora daqui de propósito.
     */
    '/',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
