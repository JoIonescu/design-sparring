import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession, signToken, setSessionCookie } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

// Called after Stripe checkout to sync the JWT with the DB plan
export async function GET(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const stripeSessionId = searchParams.get('session_id')

  // If we have a Stripe session ID, verify and update DB directly.
  // This handles the race condition where webhook hasn't fired yet.
  if (stripeSessionId) {
    try {
      const checkout = await stripe.checkout.sessions.retrieve(stripeSessionId)
      if (checkout.payment_status === 'paid' && checkout.customer) {
        await sql`
          UPDATE users SET
            plan = 'paid',
            stripe_customer_id = ${checkout.customer},
            stripe_subscription_id = ${checkout.subscription}
          WHERE id = ${session.sub}
        `
      }
    } catch (err) {
      console.error('Stripe session verify error:', err)
    }
  }

  // Re-read user from DB to get the latest plan
  const [user] = await sql`SELECT id, email, plan FROM users WHERE id = ${session.sub}`
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Issue a fresh JWT with updated plan
  const jwt = await signToken({ sub: user.id, email: user.email, plan: user.plan })
  const response = NextResponse.json({ user: { email: user.email, plan: user.plan } })
  setSessionCookie(response, jwt)
  return response
}