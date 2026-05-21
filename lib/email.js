import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMagicLink(email, token) {
  const url = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify?token=${token}`

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your Design Sparring link',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: monospace; background: #F9F7F2; padding: 48px; color: #1A1714;">
          <div style="max-width: 480px; margin: 0 auto;">
            <p style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #918D87; margin-bottom: 32px;">
              Design Sparring
            </p>
            <h1 style="font-family: sans-serif; font-size: 28px; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.02em;">
              Here's your link.
            </h1>
            <p style="font-size: 15px; color: #3A3733; margin-bottom: 32px; line-height: 1.7;">
              Click below to sign in. This link expires in 15 minutes and can only be used once.
            </p>
            <a href="${url}"
              style="display: inline-block; background: #1A1714; color: #F9F7F2; text-decoration: none;
                     font-family: monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
                     padding: 14px 28px;">
              Sign in →
            </a>
            <p style="font-size: 12px; color: #918D87; margin-top: 32px; line-height: 1.6;">
              If you didn't request this, ignore this email. Nothing will happen.
            </p>
          </div>
        </body>
      </html>
    `,
  })
}
