-- Run this in the Neon SQL editor after creating your project
-- https://console.neon.tech/ → your project → SQL editor

-- Users
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  plan        TEXT NOT NULL DEFAULT 'free',   -- 'free' | 'paid'
  stripe_customer_id      TEXT,
  stripe_subscription_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sparring sessions (paid users only — auto-expire after 30 days)
CREATE TABLE IF NOT EXISTS spar_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rationale   TEXT NOT NULL,
  exchanges   JSONB NOT NULL DEFAULT '[]',
  verdict     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

-- Index for fast user session lookups
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON spar_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON spar_sessions(expires_at);

-- Clean up expired sessions (run as a cron or manually)
-- DELETE FROM spar_sessions WHERE expires_at < NOW();
