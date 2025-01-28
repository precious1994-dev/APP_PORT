import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add a custom header to identify admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const response = NextResponse.next()
  response.headers.set('x-is-admin-route', isAdminRoute.toString())
  return response
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
} 