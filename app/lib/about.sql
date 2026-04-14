-- About content tables (singleton + cards + tools)
--
-- Apply this AFTER app/lib/media.sql (requires the `media_assets` table).
-- Safe to run multiple times.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS about_content (
  singleton_key          text PRIMARY KEY DEFAULT 'default'
                           CHECK (singleton_key = 'default'),

  about_text             text NOT NULL,

  -- Image assets are stored centrally in `media_assets`.
  -- Keep deletion safe: referenced assets cannot be deleted.
  hero_image_asset_id    uuid REFERENCES media_assets(id) ON DELETE RESTRICT,
  about_image_asset_id   uuid REFERENCES media_assets(id) ON DELETE RESTRICT,

  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT about_content_about_text_length_chk
    CHECK (length(about_text) <= 5000)
);

CREATE TABLE IF NOT EXISTS about_cards (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  about_key    text NOT NULL REFERENCES about_content(singleton_key) ON DELETE CASCADE,
  title        text NOT NULL,
  description  text NOT NULL,
  icon_key     text,
  sort_order   int NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT about_cards_title_length_chk
    CHECK (length(title) <= 200),
  CONSTRAINT about_cards_description_length_chk
    CHECK (length(description) <= 1000),
  CONSTRAINT about_cards_icon_key_length_chk
    CHECK (icon_key IS NULL OR length(icon_key) <= 60)
);

CREATE TABLE IF NOT EXISTS about_tools (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  about_key      text NOT NULL REFERENCES about_content(singleton_key) ON DELETE CASCADE,
  media_asset_id uuid NOT NULL REFERENCES media_assets(id) ON DELETE RESTRICT,
  sort_order     int NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT about_tools_about_asset_uidx UNIQUE (about_key, media_asset_id)
);

-- Ordering indexes
CREATE INDEX IF NOT EXISTS about_cards_sort_idx
  ON about_cards (about_key, sort_order);

CREATE INDEX IF NOT EXISTS about_tools_sort_idx
  ON about_tools (about_key, sort_order);

-- Auto-update updated_at (separate function name to avoid clobbering other SQL files)
CREATE OR REPLACE FUNCTION about_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_about_content_updated_at ON about_content;
CREATE TRIGGER trg_about_content_updated_at
BEFORE UPDATE ON about_content
FOR EACH ROW
EXECUTE FUNCTION about_set_updated_at();

DROP TRIGGER IF EXISTS trg_about_cards_updated_at ON about_cards;
CREATE TRIGGER trg_about_cards_updated_at
BEFORE UPDATE ON about_cards
FOR EACH ROW
EXECUTE FUNCTION about_set_updated_at();

-- Seed the singleton row (public About paragraph)
INSERT INTO about_content (singleton_key, about_text)
VALUES (
  'default',
  'I am an experienced Front-End Developer with a strong passion for creating visually appealing and user-friendly websites. I specialize in building responsive web applications that deliver seamless user experiences across various devices. I am proficient in modern frameworks such as React and Next.js.'
)
ON CONFLICT (singleton_key) DO NOTHING;

-- Seed the 3 About cards only once.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM about_cards
    WHERE about_key = 'default'
  ) THEN
    INSERT INTO about_cards (about_key, title, description, icon_key, sort_order)
    VALUES
      ('default', 'Languages', 'HTML, CSS, JavaScript React Js, Next Js', 'languages', 0),
      ('default', 'Education', 'B.Tech in Computer Science', 'education', 1),
      ('default', 'Projects', 'Built more than 5 projects', 'projects', 2);
  END IF;
END;
$$;
