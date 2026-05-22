
<img width="3384" height="573" alt="linkedin cover v3" src="https://github.com/user-attachments/assets/e9473da2-4bf5-4452-8908-2e2e212378d3" />


# Design Sparring

Stress-test your design decisions. Three rounds. A scored verdict. No encouragement.

---

Design Sparring creates spaces for designers to think together, test ideas, and sharpen solutions. Through structured feedback and collaborative critique, we turn design conversations into actionable insights and meaningful innovation.

---

## Project structure

```
app/
  page.js               ← Landing page (server component)
  spar/page.js          ← Sparring interface (server component)
  _components/
    LandingPage.jsx     ← Interactive landing (client component)
    SparringInterface.jsx ← The fight (client component)
  api/
    auth/
      send-link/        ← POST: send magic link email
      verify/           ← GET: verify token, set cookie
      logout/           ← POST: clear session cookie
    spar/               ← POST: Anthropic proxy (server-side API key)
    sessions/           ← GET/POST: session history
    account/            ← DELETE: delete account
    stripe/
      checkout/         ← POST: create Stripe checkout session
      portal/           ← POST: open Stripe billing portal
    webhooks/stripe/    ← POST: handle Stripe events

lib/
  auth.js       ← JWT sign/verify, cookie helpers
  db.js         ← Neon postgres client
  kv.js         ← Vercel KV (magic tokens, rate limiting)
  email.js      ← Resend (magic link emails)
  stripe.js     ← Stripe client + helpers

db/
  schema.sql    ← Run this once in Neon SQL editor

middleware.js   ← Edge auth check
```

