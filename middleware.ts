import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the hostname
  const hostname = request.headers.get('host') || ''
  const isHttps = request.headers.get('x-forwarded-proto')?.includes('https')

  // Check if we need to redirect to HTTPS
  if (!isHttps && hostname === 'code.arson.me') {
    const redirectUrl = `https://code.arson.me${request.nextUrl.pathname}${request.nextUrl.search}`
    return NextResponse.redirect(redirectUrl, 301)
  }

  // For all other cases, continue with the request
  return NextResponse.next()
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except static files and API routes
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 