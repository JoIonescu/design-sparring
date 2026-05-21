import { kv } from '@vercel/kv'

// Magic link tokens — 15 minute TTL
export async function storeMagicToken(token, email) {
  await kv.set(`magic:${token}`, email, { ex: 60 * 15 })
}

export async function consumeMagicToken(token) {
  const email = await kv.get(`magic:${token}`)
  if (!email) return null
  await kv.del(`magic:${token}`)
  return email
}

// Free tier rate limiting — 3 sessions per IP per day
export async function getFreeUsage(ip) {
  const key = `free:${ip}:${new Date().toISOString().slice(0, 10)}`
  const count = await kv.get(key)
  return count ? parseInt(count) : 0
}

export async function incrementFreeUsage(ip) {
  const key = `free:${ip}:${new Date().toISOString().slice(0, 10)}`
  await kv.incr(key)
  // Expire at end of day (86400 seconds)
  await kv.expire(key, 86400)
}
