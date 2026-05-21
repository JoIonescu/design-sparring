import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const checkout = await createCheckoutSession(session.sub, session.email)
  return NextResponse.json({ url: checkout.url })
}
