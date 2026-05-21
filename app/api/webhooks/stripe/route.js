import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import sql from '@/lib/db'
import { signToken } from '@/lib/auth'

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

  switch (event.type) {
    case 'checkout.session.completed': {
      const checkoutSession = event.data.object
      const userId = checkoutSession.metadata?.userId
      if (!userId) break

      await sql`
        UPDATE users SET
          plan = 'paid',
          stripe_customer_id = ${checkoutSession.customer},
          stripe_subscription_id = ${checkoutSession.subscription}
        WHERE id = ${userId}
      `
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object
      await sql`
        UPDATE users SET
          plan = 'free',
          stripe_subscription_id = NULL
        WHERE stripe_subscription_id = ${sub.id}
      `
      break
    }

    case 'invoice.payment_failed': {
      // Optionally email the user — Stripe handles retry logic
      console.log('Payment failed for subscription:', event.data.object.subscription)
      break
    }
  }

  return NextResponse.json({ received: true })
}
