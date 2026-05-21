import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
})

export async function createCheckoutSession(userId, email) {
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/#pricing`,
    metadata: { userId },
  })
}

export async function createPortalSession(stripeCustomerId) {
  return stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/`,
  })
}
