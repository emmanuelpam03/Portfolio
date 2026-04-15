-- Site settings (singleton)
-- Apply this to your Neon database. Safe to run multiple times.

CREATE TABLE IF NOT EXISTS site_settings (
  singleton_key  text PRIMARY KEY DEFAULT 'default'
                 CHECK (singleton_key = 'default'),

  display_name   text NOT NULL,
  location       text NOT NULL,
  public_email   text NOT NULL,

  hero_headline  text NOT NULL,
  hero_bio       text NOT NULL,

  github_url     text,
  linkedin_url   text,

  cv_url         text,
  tech_tags      jsonb NOT NULL DEFAULT '[]'::jsonb,

  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT site_settings_display_name_len_chk CHECK (length(display_name) <= 120),
  CONSTRAINT site_settings_location_len_chk CHECK (length(location) <= 120),
  CONSTRAINT site_settings_public_email_len_chk CHECK (length(public_email) <= 120),
  CONSTRAINT site_settings_hero_headline_len_chk CHECK (length(hero_headline) <= 160),
  CONSTRAINT site_settings_hero_bio_len_chk CHECK (length(hero_bio) <= 2000),

  CONSTRAINT site_settings_urls_len_chk CHECK (
    (github_url IS NULL OR length(github_url) <= 2048) AND
    (linkedin_url IS NULL OR length(linkedin_url) <= 2048) AND
    (cv_url IS NULL OR length(cv_url) <= 2048)
  ),

  -- Keep it simple + aligned with UI limits (16 tags max).
  CONSTRAINT site_settings_tech_tags_valid_chk CHECK (
    CASE
      WHEN jsonb_typeof(tech_tags) = 'array' THEN jsonb_array_length(tech_tags) <= 16
      ELSE FALSE
    END
  )
);

-- Auto-update updated_at on edits (unique function name to avoid collisions).
CREATE OR REPLACE FUNCTION site_settings_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON site_settings;
CREATE TRIGGER trg_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION site_settings_set_updated_at();

-- Seed default values (matches current hardcoded UI)
INSERT INTO site_settings (
  singleton_key,
  display_name,
  location,
  public_email,
  hero_headline,
  hero_bio,
  github_url,
  linkedin_url,
  cv_url,
  tech_tags
)
VALUES (
  'default',
  'Emmanuel Pam',
  'Based in Mauritius',
  'emmanuelpam03@gmail.com',
  'Full-Stack Developer',
  'I design, build, and ship full-stack products: responsive UI, secure backends, and scalable data — with React/Next.js.',
  'https://github.com/emmanuelpam03',
  NULL,
  '/sample-resume.pdf',
  '["React","Next.js","TypeScript","Tailwind"]'::jsonb
)
ON CONFLICT (singleton_key) DO NOTHING;