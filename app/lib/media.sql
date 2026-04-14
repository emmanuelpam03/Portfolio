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

-- Pre-check for existing rows before adding length constraints.
-- Pre-check: do NOT silently truncate `media_assets.url` / `media_assets.poster_url`.
-- Truncation can corrupt the stored URLs and can create collisions (including against `media_assets_url_uidx`).
-- Instead, quarantine oversized rows and abort so they can be manually remediated.
CREATE TABLE IF NOT EXISTS media_assets_quarantine (
  media_assets_id     UUID PRIMARY KEY,
  reason              TEXT NOT NULL,
  type                TEXT,
  url                 TEXT,
  poster_url          TEXT,
  url_length          INT,
  poster_url_length   INT,
  alt                 TEXT,
  caption             TEXT,
  created_at          TIMESTAMPTZ,
  logged_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO media_assets_quarantine (
  media_assets_id,
  reason,
  type,
  url,
  poster_url,
  url_length,
  poster_url_length,
  alt,
  caption,
  created_at
)
SELECT
  id,
  CASE
    WHEN length(url) > 2048 AND poster_url IS NOT NULL AND length(poster_url) > 2048
      THEN 'url_and_poster_url_too_long'
    WHEN length(url) > 2048
      THEN 'url_too_long'
    ELSE
      'poster_url_too_long'
  END AS reason,
  type,
  url,
  poster_url,
  length(url) AS url_length,
  CASE WHEN poster_url IS NULL THEN NULL ELSE length(poster_url) END AS poster_url_length,
  alt,
  caption,
  created_at
FROM media_assets
WHERE length(url) > 2048
   OR (poster_url IS NOT NULL AND length(poster_url) > 2048)
ON CONFLICT (media_assets_id) DO UPDATE SET
  reason = EXCLUDED.reason,
  type = EXCLUDED.type,
  url = EXCLUDED.url,
  poster_url = EXCLUDED.poster_url,
  url_length = EXCLUDED.url_length,
  poster_url_length = EXCLUDED.poster_url_length,
  alt = EXCLUDED.alt,
  caption = EXCLUDED.caption,
  created_at = EXCLUDED.created_at,
  logged_at = now();

DO $$
DECLARE
  oversized_count integer;
BEGIN
  SELECT count(*)
  INTO oversized_count
  FROM media_assets
  WHERE length(url) > 2048
     OR (poster_url IS NOT NULL AND length(poster_url) > 2048);

  IF oversized_count > 0 THEN
    RAISE EXCEPTION
      'Migration blocked: % media_assets row(s) have an oversized url/poster_url (media_assets.url > 2048 OR media_assets.poster_url > 2048). Review media_assets_quarantine and remediate manually before rerunning media.sql.',
      oversized_count;
  END IF;
END;
$$;

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
