-- Services (section copy + list)
-- Safe to run multiple times.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Section-level copy (singleton)
CREATE TABLE IF NOT EXISTS services_content (
  singleton_key text PRIMARY KEY DEFAULT 'default'
                 CHECK (singleton_key = 'default'),

  is_enabled boolean NOT NULL DEFAULT true,

  kicker_text  text NOT NULL,  -- "What I Offer"
  heading_text text NOT NULL,  -- "My Services"
  intro_text   text NOT NULL,  -- paragraph under heading

  show_cta         boolean NOT NULL DEFAULT true,
  cta_title        text NOT NULL,
  cta_body         text NOT NULL,
  cta_button_text  text NOT NULL,
  cta_button_href  text NOT NULL,

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT services_content_kicker_len_chk CHECK (length(kicker_text) <= 80),
  CONSTRAINT services_content_heading_len_chk CHECK (length(heading_text) <= 160),
  CONSTRAINT services_content_intro_len_chk CHECK (length(intro_text) <= 2000),

  CONSTRAINT services_content_cta_title_len_chk CHECK (length(cta_title) <= 160),
  CONSTRAINT services_content_cta_body_len_chk CHECK (length(cta_body) <= 2000),
  CONSTRAINT services_content_cta_button_text_len_chk CHECK (length(cta_button_text) <= 80),
  CONSTRAINT services_content_cta_button_href_len_chk CHECK (length(cta_button_href) <= 2048)
);

-- Services list
CREATE TABLE IF NOT EXISTS services (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  title       text NOT NULL,
  description text NOT NULL,

  -- Store a stable string key, not a React component.
  -- Example keys: 'globe', 'smartphone', 'layout', 'brush'
  icon_key    text NOT NULL,

  -- Optional: uploaded icon image URL (e.g., Cloudinary secure_url)
  icon_url    text,

  -- Optional: for a future "Read more" link (your current UI has this commented out).
  link_url    text,

  is_active   boolean NOT NULL DEFAULT true,
  sort_order  int NOT NULL DEFAULT 0,

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT services_title_len_chk CHECK (length(title) <= 200),
  CONSTRAINT services_description_len_chk CHECK (length(description) <= 1000),
  CONSTRAINT services_icon_key_len_chk CHECK (length(icon_key) <= 60),
  CONSTRAINT services_icon_url_len_chk CHECK (icon_url IS NULL OR length(icon_url) <= 2048)
);

-- Migration helper (if `services` existed already)
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS icon_url text;

ALTER TABLE services
  ADD COLUMN IF NOT EXISTS link_url text;

-- Add icon url length constraint if missing (safe upgrade)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'services_icon_url_len_chk'
      AND conrelid = 'services'::regclass
  ) THEN
    ALTER TABLE services
      ADD CONSTRAINT services_icon_url_len_chk
      CHECK (icon_url IS NULL OR length(icon_url) <= 2048);
  END IF;
END $$;

-- Add link length constraint if missing (safe upgrade)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'services_link_url_len_chk'
      AND conrelid = 'services'::regclass
  ) THEN
    ALTER TABLE services
      ADD CONSTRAINT services_link_url_len_chk
      CHECK (link_url IS NULL OR length(link_url) <= 2048);
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS services_active_sort_idx
  ON services (is_active, sort_order, created_at);

CREATE INDEX IF NOT EXISTS services_sort_idx
  ON services (sort_order, created_at);

-- Auto-update updated_at (shared)
CREATE OR REPLACE FUNCTION services_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_services_updated_at ON services;
CREATE TRIGGER trg_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION services_set_updated_at();

DROP TRIGGER IF EXISTS trg_services_content_updated_at ON services_content;
CREATE TRIGGER trg_services_content_updated_at
BEFORE UPDATE ON services_content
FOR EACH ROW
EXECUTE FUNCTION services_set_updated_at();

-- Seed section defaults once
INSERT INTO services_content (
  singleton_key,
  is_enabled,
  kicker_text,
  heading_text,
  intro_text,
  show_cta,
  cta_title,
  cta_body,
  cta_button_text,
  cta_button_href
)
VALUES (
  'default',
  true,
  'What I Offer',
  'My Services',
  'I build fast, scalable front-end experiences using React and Next.js, focused on performance and clean UI.',
  true,
  'Have a project in mind?',
  'Let''s work together to bring your ideas to life',
  'Get in Touch',
  '#contact'
)
ON CONFLICT (singleton_key) DO NOTHING;

-- Seed service cards once (mirrors current hardcoded list)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM services) THEN
    INSERT INTO services (title, description, icon_key, link_url, sort_order, is_active)
    VALUES
      ('Web design', 'Web development is the process of building, programming...', 'globe', NULL, 0, true),
      ('Mobile app', 'Mobile app development involves creating software for mobile devices...', 'smartphone', NULL, 1, true),
      ('UI/UX design', 'UI/UX design focuses on creating a seamless user experience...', 'layout', NULL, 2, true),
      ('Graphics design', 'Creative design solutions to enhance visual communication...', 'brush', NULL, 3, true);
  END IF;
END $$;