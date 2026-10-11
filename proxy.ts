// PROXY (proxy.ts): the Next.js 16 name for what used to be middleware.ts.
//
// It runs BEFORE a route renders, for every request its `matcher` selects.
// Here it does one job: if you ask for an app page without the demo cookie,
// it redirects you to /login?next=<where you were going>; and if you open
// /login or /signup while "signed in", it sends you to the dashboard.
//
// ⚠️ NOT REAL AUTH (see lib/demo-auth.ts). Even with real sessions, a proxy
// check is only a fast first gate for a nice redirect; the data layer must
// still check who is asking, because the proxy can be skipped by a matcher
// mistake and Server Actions are reachable directly.

import { NextResponse, type NextRequest } from 'next/server'
import { DEMO_COOKIE } from '@/lib/demo-auth'

export function proxy(request: NextRequest) {
  const signedIn = request.cookies.has(DEMO_COOKIE)
  const { pathname, search } = request.nextUrl

  if (pathname === '/login' || pathname === '/signup') {
    return signedIn ? NextResponse.redirect(new URL('/dashboard', request.url)) : NextResponse.next()
  }

  if (!signedIn) {
    const url = new URL('/login', request.url)
    url.searchParams.set('next', pathname + search)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

// Only these paths run the proxy. Marketing pages, static files and images
// never pay for it. (Matchers must be static strings, so the list of app
// routes is written out here rather than imported.)
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/invoices/:path*',
    '/clients/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
  ],
}
