import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession, clearSessionCookie } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { sendDeletionConfirmation } from '@/lib/email'

export async function DELETE() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [user] = await sql`SELECT email, plan, stripe_subscription_id FROM users WHERE id = ${session.sub}`
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Cancel Stripe subscription if on paid plan
  if (user.plan === 'paid' && user.stripe_subscription_id) {
    try {
      await stripe.subscriptions.cancel(user.stripe_subscription_id)
    } catch (err) {
      console.error('Stripe cancel error:', err)
      // Continue with deletion even if Stripe cancel fails
    }
  }

  // Delete user — cascades to spar_sessions
  await sql`DELETE FROM users WHERE id = ${session.sub}`

  // Send confirmation email
  try {
    await sendDeletionConfirmation(user.email, user.plan === 'paid')
  } catch (err) {
    console.error('Deletion email error:', err)
    // Don't block deletion if email fails
  }

  const response = NextResponse.json({ ok: true })
  clearSessionCookie(response)
  return response
}