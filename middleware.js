import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Routes that require authentication
const PROTECTED = ['/spar']

export async function middleware(request) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get('ds_session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/?auth=required', request.url))
  }

  const session = await verifyToken(token)
  if (!session) {
    return NextResponse.redirect(new URL('/?auth=expired', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/spar/:path*'],
}
