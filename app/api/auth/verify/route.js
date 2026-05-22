import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { consumeMagicToken } from '@/lib/kv'
import { signToken, setSessionCookie } from '@/lib/auth'

export async function GET(request) {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://design-sparring.vercel.app'
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(`${appUrl}/?auth=invalid`)
  }

  try {
    const email = await consumeMagicToken(token)

    if (!email) {
      // Token expired or already used
      return NextResponse.redirect(`${appUrl}/?auth=expired`)
    }

    const [user] = await sql`
      SELECT id, email, plan FROM users WHERE email = ${email}
    `

    if (!user) {
      return NextResponse.redirect(`${appUrl}/?auth=error`)
    }

    const jwt = await signToken({
      sub: user.id,
      email: user.email,
      plan: user.plan,
    })

    const response = NextResponse.redirect(`${appUrl}/?auth=success`)
    setSessionCookie(response, jwt)
    return response

  } catch (error) {
    console.error('verify error:', error)
    return NextResponse.redirect(`${appUrl}/?auth=error`)
  }
}