-- Admin auth tables (magic link + sessions)

CREATE TABLE IF NOT EXISTS admin_allowlist (
  email text PRIMARY KEY,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_login_tokens (
  id bigserial PRIMARY KEY,
  email text NOT NULL,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_login_tokens_lookup_idx
  ON admin_login_tokens (email, token_hash);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  session_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS admin_sessions_hash_uidx
  ON admin_sessions (session_hash);

CREATE INDEX IF NOT EXISTS admin_sessions_expires_idx
  ON admin_sessions (expires_at);
