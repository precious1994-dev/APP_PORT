import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it's an admin route
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    // Allow access to the login page
    if (pathname === '/admin') {
      return NextResponse.next()
    }

    // Check for authentication token
    const token = await getToken({ req: request })

    // If no token found, redirect to login
    if (!token) {
      const url = new URL('/admin', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 