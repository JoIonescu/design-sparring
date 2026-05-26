import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM

const STYLE_NAMES = {R:'Rational',I:'Intuitive',D:'Dependent',A:'Avoidant',S:'Spontaneous'}
const RESULT_TAGLINES = {
R:'Evidence-driven. Systematic. Defensible.',
I:'Pattern-matching at speed. Confident under pressure.',
D:'Dialogue-driven. Inclusive. Attuned.',
A:'Measured. Risk-aware. Thorough by nature.',
S:'Action-oriented. Iterative. Momentum-led.',
}

export async function POST(request) {
try {
const { email, winner, scores, resultType } = await request.json()
if (!email || !email.includes('@')) {
return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
}

const scoreRows = Object.entries(scores)
.sort((a, b) => b[1] - a[1])
.map(([style, score]) =>
`<tr><td style="font-family:monospace;font-size:13px;padding:8px 0;color:#1A1714;width:120px;">${STYLE_NAMES[style]}</td><td style="padding:8px 0;"><div style="height:6px;background:#EEE;width:200px;"><div style="height:6px;background:${style===winner?'#C63B15':'#1A1714'};width:${score*20}%;"></div></div></td><td style="font-family:monospace;font-size:12px;color:#918D87;padding:8px 0 8px 12px;">${score}/10</td></tr>`
).join('')

await resend.emails.send({
from: FROM,
to: email,
subject: `Your decision-making style: ${resultType}`,
html: `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#F9F7F2;padding:48px;color:#1A1714;">
<div style="max-width:520px;margin:0 auto;">
<p style="font-family:monospace;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#918D87;margin-bottom:32px;">Design Sparring — Decision Style Assessment</p>
<h1 style="font-family:'Lato',sans-serif;font-size:32px;font-weight:900;letter-spacing:-0.02em;margin-bottom:6px;">${resultType}</h1>
<p style="font-family:monospace;font-size:13px;color:#918D87;margin-bottom:28px;letter-spacing:0.04em;">${RESULT_TAGLINES[winner] || ''}</p>
<div style="padding:20px;background:#fff;border-left:3px solid #C63B15;margin-bottom:28px;">
<p style="font-size:13px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;color:#C63B15;margin-bottom:12px;">Score Breakdown</p>
<table style="border-collapse:collapse;">${scoreRows}</table>
</div>
<p style="font-size:13px;color:#918D87;line-height:1.7;margin-bottom:28px;">This assessment is based on the General Decision-Making Style (GDMS) model by Scott & Bruce (1995). It is an adaptation for self-reflection purposes, not a clinical instrument.</p>
<a href="${process.env.NEXT_PUBLIC_URL}" style="display:inline-block;background:#1A1714;color:#F9F7F2;text-decoration:none;font-family:monospace;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:12px 24px;">Try Design Sparring</a>
<p style="font-size:11px;color:#C8C4BC;margin-top:32px;font-family:monospace;">Scott, S. G., & Bruce, R. A. (1995). Decision-making style: The development and assessment of a new measure. Educational and Psychological Measurement, 55(5), 818-831.</p>
</div>
</body></html>`,
})

return NextResponse.json({ ok: true })
} catch (err) {
console.error('Quiz email error:', err)
return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
}
}