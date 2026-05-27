import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sessions = await sql`
    SELECT id, rationale, exchanges, verdict, created_at
    FROM spar_sessions
    WHERE user_id = ${session.sub}
      AND (expires_at IS NULL OR expires_at > NOW())
    ORDER BY created_at DESC
    LIMIT 50
  `
  return NextResponse.json({ sessions })
}

export async function POST(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { rationale, exchanges, verdict } = await request.json()
  if (!rationale) return NextResponse.json({ error: 'Rationale required' }, { status: 400 })

  const [saved] = await sql`
    INSERT INTO spar_sessions (user_id, rationale, exchanges, verdict, expires_at)
    VALUES (
      ${session.sub},
      ${rationale},
      ${JSON.stringify(exchanges || [])},
      ${verdict ? JSON.stringify(verdict) : null},
      NOW() + INTERVAL '30 days'
    )
    RETURNING id, created_at
  `
  return NextResponse.json({ ok: true, id: saved.id })
}