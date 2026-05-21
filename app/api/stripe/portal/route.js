import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'
import { createPortalSession } from '@/lib/stripe'

export async function POST() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [user] = await sql`SELECT stripe_customer_id FROM users WHERE id = ${session.sub}`
  if (!user?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
  }

  const portal = await createPortalSession(user.stripe_customer_id)
  return NextResponse.json({ url: portal.url })
}
