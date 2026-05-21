import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getSession } from '@/lib/auth'
import { getFreeUsage, incrementFreeUsage } from '@/lib/kv'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SPAR_SYSTEM = `You are the Design Sparring opponent. Your sole purpose is to argue against design decisions.

Rules:
- Argue against whatever design rationale is presented. Be specific, pointed, and direct.
- Reference UX research, established patterns, or design principles when relevant.
- Keep responses to 3-5 sentences — dense and focused, no padding.
- Do not soften. Do not offer encouragement. Do not suggest what they should do instead.
- If the input is clearly not a design decision, respond only with: "That's not a design decision. Bring me one."
- Stay strictly in character at all times.`

const VERDICT_SYSTEM = `You are the Design Sparring judge. Review the full exchange and deliver a verdict.

Respond ONLY in valid JSON with no other text, no markdown, no backticks:
{"clarity":<1-5>,"userImpact":<1-5>,"defensibility":<1-5>,"blindSpots":["<gap 1>","<gap 2>"],"summary":"<2-3 sentence honest assessment>"}

Scoring:
- clarity: Was the rationale well-structured and clearly reasoned?
- userImpact: Did they account for the end user's needs?
- defensibility: How well did the argument hold under pressure across all rounds?
- blindSpots: 1-2 specific things completely missing from their argument`

export async function POST(request) {
  const session = await getSession()
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'

  const { messages, isVerdict } = await request.json()

  // Free users: check rate limit
  if (!session) {
    const usage = await getFreeUsage(ip)
    if (usage >= 3) {
      return NextResponse.json(
        { error: 'Free tier limit reached. Come back tomorrow or upgrade.' },
        { status: 429 }
      )
    }
    await incrementFreeUsage(ip)
  }

  // Paid gate: verdict is paid only
  if (isVerdict && session?.plan !== 'paid') {
    return NextResponse.json({ error: 'Verdict scoring is a paid feature.' }, { status: 403 })
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: isVerdict ? VERDICT_SYSTEM : SPAR_SYSTEM,
      messages,
    })

    return NextResponse.json({ text: response.content[0].text })
  } catch (error) {
    console.error('Anthropic error:', error)
    return NextResponse.json({ error: 'AI call failed' }, { status: 500 })
  }
}
