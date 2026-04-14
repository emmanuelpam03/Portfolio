-- Centralized media library (images + videos)
--
-- Apply this to your Neon database (alongside auth.sql/projects.sql).
-- Safe to run multiple times.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS media_assets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url         TEXT NOT NULL,
  poster_url  TEXT,
  alt         TEXT,
  caption     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- De-dupe by URL so assets referenced in Projects only create one row.
CREATE UNIQUE INDEX IF NOT EXISTS media_assets_url_uidx ON media_assets (url);

CREATE INDEX IF NOT EXISTS media_assets_created_at_idx
  ON media_assets (created_at DESC);

CREATE INDEX IF NOT EXISTS media_assets_type_created_at_idx
  ON media_assets (type, created_at DESC);
