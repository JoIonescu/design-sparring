import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM
const CONTACT = 'contact@design-sparring.org'

const base = (content) => `
  <!DOCTYPE html><html>
  <body style="font-family:sans-serif;background:#F9F7F2;padding:48px;color:#1A1714;">
  <div style="max-width:480px;margin:0 auto;">
    <p style="font-family:monospace;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#918D87;margin-bottom:32px;">Design Sparring</p>
    ${content}
    <p style="font-size:12px;color:#918D87;margin-top:40px;line-height:1.6;">
      Questions? <a href="mailto:${CONTACT}" style="color:#C63B15;">${CONTACT}</a>
    </p>
  </div>
  </body></html>
`

export async function sendMagicLink(email, token) {
  const url = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify?token=${token}`
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Your Design Sparring link',
    html: base(`
      <h1 style="font-family:sans-serif;font-size:28px;font-weight:700;margin-bottom:16px;letter-spacing:-0.02em;">Here is your link.</h1>
      <p style="font-size:15px;color:#3A3733;margin-bottom:32px;line-height:1.7;">Click below to sign in. Expires in 15 minutes, single use.</p>
      <a href="${url}" style="display:inline-block;background:#1A1714;color:#F9F7F2;text-decoration:none;font-family:monospace;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:14px 28px;border-radius:3px;">Sign in</a>
    `),
  })
}

export async function sendDeletionConfirmation(email, wasPaid = false) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Your Design Sparring account has been deleted',
    html: base(`
      <h1 style="font-family:sans-serif;font-size:28px;font-weight:700;margin-bottom:16px;letter-spacing:-0.02em;">Account deleted.</h1>
      <p style="font-size:15px;color:#3A3733;margin-bottom:16px;line-height:1.7;">Your Design Sparring account has been permanently deleted.</p>
      ${wasPaid ? `
        <p style="font-size:15px;color:#3A3733;margin-bottom:16px;line-height:1.7;">Your Sparring Partner subscription has been cancelled. You will not be charged again.</p>
        <p style="font-size:15px;color:#3A3733;margin-bottom:32px;line-height:1.7;">All session history has been permanently removed.</p>
      ` : ''}
      <p style="font-size:13px;color:#918D87;line-height:1.6;">If you did not request this, contact us immediately.</p>
    `),
  })
}

export async function sendPaymentFailedEmail(email) {
  const portalUrl = `${process.env.NEXT_PUBLIC_URL}/`
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Action needed — payment failed',
    html: base(`
      <h1 style="font-family:sans-serif;font-size:28px;font-weight:700;margin-bottom:16px;letter-spacing:-0.02em;">Payment failed.</h1>
      <p style="font-size:15px;color:#3A3733;margin-bottom:16px;line-height:1.7;">We could not charge your card for your Sparring Partner subscription. Your access has not been interrupted yet.</p>
      <p style="font-size:15px;color:#3A3733;margin-bottom:32px;line-height:1.7;">Please update your payment method to keep your account active. We will retry automatically.</p>
      <a href="${portalUrl}" style="display:inline-block;background:#C63B15;color:white;text-decoration:none;font-family:monospace;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:14px 28px;border-radius:3px;">Update payment method</a>
    `),
  })
}

export async function sendPaymentRecoveredEmail(email) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Payment received — welcome to Sparring Partner',
    html: base(`
      <h1 style="font-family:sans-serif;font-size:28px;font-weight:700;margin-bottom:16px;letter-spacing:-0.02em;">Payment received.</h1>
      <p style="font-size:15px;color:#3A3733;margin-bottom:16px;line-height:1.7;">Your payment was processed successfully. Your Sparring Partner access is fully active.</p>
      <p style="font-size:15px;color:#3A3733;margin-bottom:32px;line-height:1.7;">Update your billing information, download your invoice or cancel your subscription from <strong>Your account &rarr; Manage billing</strong>.</p>
    `),
  })
}