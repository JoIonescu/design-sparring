import { NextResponse } from 'next/server'
import crypto from 'crypto'
import sql from '@/lib/db'
import { storeMagicToken } from '@/lib/kv'
import { sendMagicLink } from '@/lib/email'

export async function POST(request) {
  try {
    const { email, mode } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${normalizedEmail}`
    const userExists = existing.length > 0

    if (mode === 'signup' && userExists) {
      // Account already exists — tell frontend to redirect to sign in
      return NextResponse.json({ error: 'exists' }, { status: 409 })
    }

    if (mode === 'login' && !userExists) {
      // No account found — tell frontend to redirect to sign up
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    // Create user if signing up
    if (mode === 'signup') {
      await sql`INSERT INTO users (email) VALUES (${normalizedEmail}) ON CONFLICT (email) DO NOTHING`
    }

    // Generate and store magic token
    const token = crypto.randomBytes(32).toString('hex')
    await storeMagicToken(token, normalizedEmail)
    await sendMagicLink(normalizedEmail, token)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('send-link error:', error)
    return NextResponse.json({ error: 'Failed to send link' }, { status: 500 })
  }
}