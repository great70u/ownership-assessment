import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const session = request.cookies.get('zinkro_session')
  const onboarded = request.cookies.get('zinkro_onboarded')
  const { pathname } = request.nextUrl

  // Must be logged in to reach the dashboard
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Must complete onboarding before the dashboard
  if (pathname.startsWith('/dashboard') && session && !onboarded) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // Onboarding: needs a session; bypass if already done
  if (pathname === '/onboarding') {
    if (!session) return NextResponse.redirect(new URL('/login', request.url))
    if (onboarded) return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Logged-in users don't need the auth pages
  if (pathname === '/login' || pathname === '/signup') {
    if (session) {
      return NextResponse.redirect(new URL(onboarded ? '/dashboard' : '/onboarding', request.url))
    }
  }

  // Root — land on the right page
  if (pathname === '/') {
    if (!session) return NextResponse.redirect(new URL('/login', request.url))
    return NextResponse.redirect(new URL(onboarded ? '/dashboard' : '/onboarding', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/signup', '/onboarding', '/dashboard/:path*'],
}
