import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the hostname
  const hostname = request.headers.get('host') || ''

  // Only redirect if it's our specific domain
  const isDomain = hostname === 'code.arson.me'
  
  // Check if the request is HTTP
  if (!request.headers.get('x-forwarded-proto')?.includes('https') && isDomain) {
    // Create the HTTPS URL
    const httpsUrl = `https://code.arson.me${request.nextUrl.pathname}${request.nextUrl.search}`
    
    // Return 301 permanent redirect
    return NextResponse.redirect(httpsUrl, {
      statusCode: 301,
      headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
      }
    })
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API routes
     * - Static files
     * - Assets
     * - Images
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 