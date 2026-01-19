import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Redirect root to /admin when accessing via admin subdomain
  if (hostname.startsWith('admin.') && pathname === '/') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Handle auth session for admin routes
  if (pathname.startsWith('/admin')) {
    return await updateSession(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match admin routes and root path for subdomain redirect
     */
    '/',
    '/admin/:path*',
  ],
}
