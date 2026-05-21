import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { consumeMagicToken } from '@/lib/kv'
import { signToken, setSessionCookie } from '@/lib/auth'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/?auth=invalid', request.url))
  }

  const email = await consumeMagicToken(token)

  if (!email) {
    // Token expired or already used
    return NextResponse.redirect(new URL('/?auth=expired', request.url))
  }

  // Get the user
  const [user] = await sql`
    SELECT id, email, plan FROM users WHERE email = ${email}
  `

  if (!user) {
    return NextResponse.redirect(new URL('/?auth=error', request.url))
  }

  // Sign a JWT
  const jwt = await signToken({
    sub: user.id,
    email: user.email,
    plan: user.plan,
  })

  const response = NextResponse.redirect(new URL('/', request.url))
  setSessionCookie(response, jwt)
  return response
}
