-- Projects Table

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Migration helper (safe to run multiple times):
-- If an existing `projects` table still has `image_url`, rename it to `hero_image_url`.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'projects'
      AND column_name = 'image_url'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'projects'
      AND column_name = 'hero_image_url'
  ) THEN
    ALTER TABLE projects RENAME COLUMN image_url TO hero_image_url;
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS projects (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               VARCHAR(255) NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT NOT NULL,
  hero_image_url      TEXT NOT NULL,
  project_live_url    TEXT,
  project_github_url  TEXT NOT NULL,
  is_published        BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_github_url CHECK(project_github_url LIKE 'https://github.com/%')
);

-- Project Media Table (unlimited images/videos per project)
CREATE TABLE IF NOT EXISTS project_media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url         TEXT NOT NULL,
  poster_url  TEXT,
  alt         TEXT NOT NULL,
  caption     TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration helper: older versions allowed NULL/blank alt.
-- Backfill before enforcing NOT NULL.
-- This backfill uses caption-derived text first, then filename-derived text from `url`,
-- then finally the generic CASE fallback (CASE WHEN type = 'video' THEN 'Video' ELSE 'Image' END).
-- Rows that end up using the filename-derived logic or the generic fallback are recorded for manual review.
BEGIN;

LOCK TABLE project_media IN ACCESS EXCLUSIVE MODE;

CREATE TABLE IF NOT EXISTS project_media_alt_backfill_audit (
  project_media_id UUID PRIMARY KEY,
  reason           TEXT NOT NULL,
  derived_alt      TEXT NOT NULL,
  type             TEXT NOT NULL,
  url              TEXT NOT NULL,
  caption          TEXT,
  logged_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

WITH candidates AS (
  SELECT
    pm.id,
    pm.type,
    pm.url,
    pm.caption,
    NULLIF(BTRIM(pm.caption), '') AS caption_alt,
    NULLIF(
      INITCAP(
        REPLACE(
          REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(split_part(pm.url, '?', 1), '^.*/', ''),
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
    ) AS filename_alt,
    CASE WHEN pm.type = 'video' THEN 'Video' ELSE 'Image' END AS generic_alt
  FROM project_media pm
  WHERE pm.alt IS NULL OR BTRIM(pm.alt) = ''
),
backfill AS (
  SELECT
    id,
    type,
    url,
    caption,
    caption_alt,
    filename_alt,
    generic_alt,
    LEFT(COALESCE(caption_alt, filename_alt, generic_alt), 200) AS new_alt,
    (caption_alt IS NULL AND filename_alt IS NOT NULL) AS used_filename_derived,
    (caption_alt IS NULL AND filename_alt IS NULL) AS used_generic_fallback
  FROM candidates
),
updated AS (
  UPDATE project_media pm
  SET alt = b.new_alt
  FROM backfill b
  WHERE pm.id = b.id
  RETURNING
    pm.id AS project_media_id,
    b.type,
    b.url,
    b.caption,
    b.new_alt,
    b.used_filename_derived,
    b.used_generic_fallback
)
INSERT INTO project_media_alt_backfill_audit (
  project_media_id,
  reason,
  derived_alt,
  type,
  url,
  caption
)
SELECT
  project_media_id,
  CASE
    WHEN used_generic_fallback THEN 'generic_fallback_case'
    WHEN used_filename_derived THEN 'filename_derived_from_url'
  END AS reason,
  new_alt AS derived_alt,
  type,
  url,
  caption
FROM updated
WHERE used_generic_fallback OR used_filename_derived
ON CONFLICT (project_media_id) DO NOTHING;

-- Safety clamp for existing rows.
UPDATE project_media
SET alt = LEFT(alt, 200)
WHERE length(alt) > 200;

ALTER TABLE project_media
  ALTER COLUMN alt SET NOT NULL;

COMMIT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_media_project_sort
  ON project_media(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_media_project
  ON project_media(project_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();