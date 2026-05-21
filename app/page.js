import { getSession } from '@/lib/auth'
import LandingPage from '@/app/_components/LandingPage'

export default async function Home({ searchParams }) {
  const session = await getSession()
  const authError = searchParams?.auth

  return (
    <LandingPage
      user={session ? { email: session.email, plan: session.plan } : null}
      authError={authError}
    />
  )
}
