import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'

// GET /api/sessions — fetch session history for logged-in paid user
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.plan !== 'paid') return NextResponse.json({ sessions: [] })

  const sessions = await sql`
    SELECT id, rationale, verdict, created_at
    FROM spar_sessions
    WHERE user_id = ${session.sub}
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 20
  `

  return NextResponse.json({ sessions })
}

// POST /api/sessions — save a completed session (paid users only)
export async function POST(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.plan !== 'paid') return NextResponse.json({ error: 'Paid plan required' }, { status: 403 })

  const { rationale, exchanges, verdict } = await request.json()

  if (!rationale || !exchanges) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const [saved] = await sql`
    INSERT INTO spar_sessions (user_id, rationale, exchanges, verdict)
    VALUES (${session.sub}, ${rationale}, ${JSON.stringify(exchanges)}, ${verdict ? JSON.stringify(verdict) : null})
    RETURNING id
  `

  return NextResponse.json({ id: saved.id })
}
