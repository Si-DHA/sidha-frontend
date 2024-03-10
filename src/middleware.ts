import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const protectedRoutes = ['/dashboard', '/profile']
export const unprotectedRoutes = ['/login', '/forgot-password', '/reset-password', ]
 
export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')

  if (protectedRoutes.includes(request.url) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (unprotectedRoutes.includes(request.url) && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next()
}