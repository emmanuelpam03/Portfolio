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
  alt         TEXT NOT NULL,
  caption     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT media_assets_url_length_chk CHECK (length(url) <= 2048),
  CONSTRAINT media_assets_poster_url_length_chk CHECK (
    poster_url IS NULL OR length(poster_url) <= 2048
  ),
  CONSTRAINT media_assets_alt_length_chk CHECK (length(alt) <= 300),
  CONSTRAINT media_assets_caption_length_chk CHECK (
    caption IS NULL OR length(caption) <= 1000
  )
);

-- Migration helper: older versions allowed NULL/blank alt.
-- Backfill before enforcing NOT NULL.
UPDATE media_assets
SET alt = LEFT(
  COALESCE(
    NULLIF(BTRIM(caption), ''),
    NULLIF(
      INITCAP(
        REPLACE(
          REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(split_part(url, '?', 1), '^.*/', ''),
              E'\\.[^.]*$',
              ''
            ),
            '_',
            ' '
          ),
          '-',
          ' '
        )
      ),
      ''
    ),
    CASE WHEN type = 'video' THEN 'Video' ELSE 'Image' END
  ),
  300
)
WHERE alt IS NULL OR BTRIM(alt) = '';

-- Safety clamp for existing rows before adding length constraints.
UPDATE media_assets
SET url = LEFT(url, 2048)
WHERE length(url) > 2048;

UPDATE media_assets
SET poster_url = LEFT(poster_url, 2048)
WHERE poster_url IS NOT NULL AND length(poster_url) > 2048;

UPDATE media_assets
SET alt = LEFT(alt, 300)
WHERE length(alt) > 300;

UPDATE media_assets
SET caption = LEFT(caption, 1000)
WHERE caption IS NOT NULL AND length(caption) > 1000;

ALTER TABLE media_assets
  ALTER COLUMN alt SET NOT NULL;

-- Migration helper: add max-length constraints for text columns.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'media_assets_url_length_chk'
      AND conrelid = 'media_assets'::regclass
  ) THEN
    ALTER TABLE media_assets
      ADD CONSTRAINT media_assets_url_length_chk
      CHECK (length(url) <= 2048);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'media_assets_poster_url_length_chk'
      AND conrelid = 'media_assets'::regclass
  ) THEN
    ALTER TABLE media_assets
      ADD CONSTRAINT media_assets_poster_url_length_chk
      CHECK (poster_url IS NULL OR length(poster_url) <= 2048);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'media_assets_alt_length_chk'
      AND conrelid = 'media_assets'::regclass
  ) THEN
    ALTER TABLE media_assets
      ADD CONSTRAINT media_assets_alt_length_chk
      CHECK (length(alt) <= 300);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'media_assets_caption_length_chk'
      AND conrelid = 'media_assets'::regclass
  ) THEN
    ALTER TABLE media_assets
      ADD CONSTRAINT media_assets_caption_length_chk
      CHECK (caption IS NULL OR length(caption) <= 1000);
  END IF;
END;
$$;

-- De-dupe by URL so assets referenced in Projects only create one row.
CREATE UNIQUE INDEX IF NOT EXISTS media_assets_url_uidx ON media_assets (url);

CREATE INDEX IF NOT EXISTS media_assets_created_at_idx
  ON media_assets (created_at DESC);

CREATE INDEX IF NOT EXISTS media_assets_type_created_at_idx
  ON media_assets (type, created_at DESC);
