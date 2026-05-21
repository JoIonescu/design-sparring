import { NextResponse } from 'next/server'
import crypto from 'crypto'
import sql from '@/lib/db'
import { storeMagicToken } from '@/lib/kv'
import { sendMagicLink } from '@/lib/email'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Upsert user — create if not exists
    await sql`
      INSERT INTO users (email)
      VALUES (${normalizedEmail})
      ON CONFLICT (email) DO NOTHING
    `

    // Generate token and store in KV
    const token = crypto.randomBytes(32).toString('hex')
    await storeMagicToken(token, normalizedEmail)

    // Send email
    await sendMagicLink(normalizedEmail, token)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('send-link error:', error)
    return NextResponse.json({ error: 'Failed to send link' }, { status: 500 })
  }
}
