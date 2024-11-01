import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get hostname from request
  const hostname = request.headers.get('host') || ''

  // Only redirect if it's our domain and not an IP address
  const isDomain = hostname === 'arson.me' || hostname === 'www.arson.me'
  const isNotIP = !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname)

  // Check if the request is HTTP and it's our domain
  if (
    !request.headers.get('x-forwarded-proto')?.includes('https') &&
    isDomain &&
    isNotIP
  ) {
    // Create the HTTPS URL
    const httpsUrl = `https://${hostname}${request.nextUrl.pathname}${request.nextUrl.search}`
    return NextResponse.redirect(httpsUrl, 301)
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
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