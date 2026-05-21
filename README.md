# Design Sparring

Stress-test your design decisions. Three rounds. A scored verdict. No encouragement.

---

## Stack

- **Next.js 14** (App Router)
- **Vercel** — hosting + KV (Upstash Redis)
- **Neon** — Postgres database
- **Resend** — transactional email (magic links)
- **Stripe** — subscriptions ($9/mo)
- **Anthropic** — Claude API (sparring + verdicts)

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/yourname/design-sparring.git
cd design-sparring
npm install
```

### 2. Create a Neon database

1. Go to [neon.tech](https://neon.tech) → New project
2. Copy the connection string
3. Open the **SQL editor** and paste + run the contents of `db/schema.sql`

### 3. Set up Vercel KV

1. Push the repo to GitHub
2. Import to [vercel.com](https://vercel.com) → New Project
3. In your project dashboard: **Storage → Create → KV**
4. Vercel auto-populates the KV env vars

### 4. Set up Resend

1. Go to [resend.com](https://resend.com) → free account
2. Add your domain (or use the sandbox for testing)
3. Copy your API key

### 5. Set up Stripe

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Products → Add product**: Design Sparring / $9 / Monthly recurring
3. Copy the **Price ID** (starts with `price_`)
4. **Developers → Webhooks → Add endpoint**:
   - URL: `https://your-app.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
5. Copy the **Webhook signing secret**

### 6. Configure environment variables

```bash
cp .env.example .env.local
# Fill in all values
```

Then add all env vars to Vercel dashboard under **Settings → Environment Variables**.

### 7. Deploy

```bash
git push origin main
# Vercel auto-deploys on push
```

Your app is live at `https://your-project.vercel.app`

---

## Local development

```bash
npm run dev
# http://localhost:3000
```

For Stripe webhooks locally:
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

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

---

## Notes

- Free tier: 3 sessions/day per IP, 1 round each, no login required
- Paid tier: unlimited sessions, 3 rounds + verdict, 30-day history
- Sessions auto-expire after 30 days via `expires_at` column
- The Anthropic API key never touches the client — all AI calls go through `/api/spar`
