import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import sql from '@/lib/db'
import { sendPaymentFailedEmail, sendPaymentRecoveredEmail } from '@/lib/email'

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {

      // ── Payment succeeded via checkout ──────────────────────────────
      case 'checkout.session.completed': {
        const cs = event.data.object
        const userId = cs.metadata?.userId
        if (!userId) break
        await sql`
          UPDATE users SET
            plan = 'paid',
            stripe_customer_id = ${cs.customer},
            stripe_subscription_id = ${cs.subscription}
          WHERE id = ${userId}
        `
        break
      }

      // ── Subscription status changed (past_due, active recovery, etc) ─
      case 'customer.subscription.updated': {
        const sub = event.data.object
        const status = sub.status
        if (status === 'active') {
          // Recovered from past_due
          await sql`UPDATE users SET plan = 'paid' WHERE stripe_subscription_id = ${sub.id}`
          const [user] = await sql`SELECT email FROM users WHERE stripe_subscription_id = ${sub.id}`
          if (user) await sendPaymentRecoveredEmail(user.email).catch(console.error)
        } else if (status === 'unpaid' || status === 'canceled') {
          await sql`UPDATE users SET plan = 'free' WHERE stripe_subscription_id = ${sub.id}`
        }
        // past_due: keep plan active during grace period, Stripe retries
        break
      }

      // ── Subscription cancelled (portal cancel or account delete) ────
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        await sql`
          UPDATE users SET plan = 'free', stripe_subscription_id = NULL
          WHERE stripe_subscription_id = ${sub.id}
        `
        break
      }

      // ── Invoice paid (renewal confirmation) ─────────────────────────
      case 'invoice.paid': {
        const invoice = event.data.object
        if (invoice.billing_reason === 'subscription_cycle') {
          // Renewal — ensure plan is still marked paid
          await sql`
            UPDATE users SET plan = 'paid'
            WHERE stripe_customer_id = ${invoice.customer} AND plan != 'paid'
          `
        }
        break
      }

      // ── Payment failed — warn user, Stripe will retry ───────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const [user] = await sql`SELECT email FROM users WHERE stripe_customer_id = ${invoice.customer}`
        if (user) await sendPaymentFailedEmail(user.email).catch(console.error)
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    // Return 200 so Stripe doesn't retry — log and investigate manually
  }

  return NextResponse.json({ received: true })
}