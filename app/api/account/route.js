import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession, clearSessionCookie } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

export async function DELETE() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Cancel Stripe subscription if on paid plan
  if (session.plan === 'paid') {
    const [user] = await sql`
      SELECT stripe_subscription_id FROM users WHERE id = ${session.sub}
    `
    if (user?.stripe_subscription_id) {
      await stripe.subscriptions.cancel(user.stripe_subscription_id).catch(console.error)
    }
  }

  // Delete user — cascades to spar_sessions
  await sql`DELETE FROM users WHERE id = ${session.sub}`

  const response = NextResponse.json({ ok: true })
  clearSessionCookie(response)
  return response
}
