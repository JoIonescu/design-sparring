import { getSession } from '@/lib/auth'
import SparringInterface from '@/app/_components/SparringInterface'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Design Sparring — Session' }

export default async function SparPage() {
  // Middleware handles redirect if not logged in for paid route,
  // but free users (no session) can also access — just with limits
  const session = await getSession()

  return (
    <SparringInterface
      user={session ? { email: session.email, plan: session.plan } : null}
    />
  )
}
