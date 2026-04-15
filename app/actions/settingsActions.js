"use server";

import { revalidatePath } from "next/cache";

import { sql } from "@/app/lib/db";
import { requireAdmin } from "@/app/lib/adminSession";
import { settingsUpdateSchema } from "@/app/lib/schema";

function toErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong.";
}

function trimOrNull(value) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function isMissingSettingsTable(error) {
  const message = String(error instanceof Error ? error.message : error);
  return message.includes('relation "site_settings" does not exist');
}

function setupMessageFromError(error) {
  if (isMissingSettingsTable(error)) {
    return "Settings table is missing. Apply app/lib/settings.sql to your database.";
  }
  return null;
}

function validationErrorState(raw, parsed) {
  const flattened = parsed.error.flatten();
  return {
    ok: false,
    message: "Please fix the highlighted fields.",
    errors: flattened.fieldErrors,
    fields: raw,
  };
}

function safeTechTagsFromJson(value) {
  const raw = String(value ?? "[]");
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid tech tags JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid tech tags JSON");
  }

  return parsed;
}

function normalizeTechTags(tags) {
  const seen = new Set();
  const next = [];

  for (const item of Array.isArray(tags) ? tags : []) {
    const text = String(item ?? "").trim();
    if (!text) continue;

    const key = text.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    next.push(text);

    if (next.length >= 16) break;
  }

  return next;
}

async function loadSettingsRow() {
  const rows = await sql`
    SELECT
      display_name,
      location,
      public_email,
      hero_headline,
      hero_bio,
      github_url,
      linkedin_url,
      cv_url,
      tech_tags
    FROM site_settings
    WHERE singleton_key = 'default'
    LIMIT 1
  `;

  return rows?.[0] ?? null;
}

function normalizeSettingsRow(row) {
  let techTags = [];
  const rawTags = row?.tech_tags;

  if (Array.isArray(rawTags)) {
    techTags = rawTags;
  } else if (typeof rawTags === "string" && rawTags.trim()) {
    try {
      const parsed = JSON.parse(rawTags);
      if (Array.isArray(parsed)) techTags = parsed;
    } catch {
      techTags = [];
    }
  }

  return {
    display_name: row?.display_name ? String(row.display_name) : "",
    location: row?.location ? String(row.location) : "",
    public_email: row?.public_email ? String(row.public_email) : "",

    hero_headline: row?.hero_headline ? String(row.hero_headline) : "",
    hero_bio: row?.hero_bio ? String(row.hero_bio) : "",

    github_url: row?.github_url ? String(row.github_url) : null,
    linkedin_url: row?.linkedin_url ? String(row.linkedin_url) : null,

    cv_url: row?.cv_url ? String(row.cv_url) : null,
    tech_tags: normalizeTechTags(techTags),
  };
}

export async function getSettingsPublic() {
  try {
    const row = await loadSettingsRow();
    return { ok: true, settings: normalizeSettingsRow(row), message: null };
  } catch (error) {
    const setupMessage = setupMessageFromError(error);
    if (setupMessage)
      return { ok: false, settings: null, message: setupMessage };

    console.error("Failed to load public settings", error);
    return { ok: false, settings: null, message: toErrorMessage(error) };
  }
}

export async function getSettingsAdmin() {
  await requireAdmin();

  try {
    const row = await loadSettingsRow();
    return { ok: true, settings: normalizeSettingsRow(row), message: null };
  } catch (error) {
    const setupMessage = setupMessageFromError(error);
    if (setupMessage)
      return { ok: false, settings: null, message: setupMessage };

    console.error("Failed to load admin settings", error);
    return { ok: false, settings: null, message: toErrorMessage(error) };
  }
}

export async function updateSettingsAction(_prevState, formData) {
  await requireAdmin();

  let raw;
  try {
    const tags = normalizeTechTags(
      safeTechTagsFromJson(formData.get("tech_tags_json")),
    );

    raw = {
      display_name: String(formData.get("display_name") ?? ""),
      location: String(formData.get("location") ?? ""),
      public_email: String(formData.get("public_email") ?? ""),

      hero_headline: String(formData.get("hero_headline") ?? ""),
      hero_bio: String(formData.get("hero_bio") ?? ""),

      github_url: trimOrNull(formData.get("github_url")),
      linkedin_url: trimOrNull(formData.get("linkedin_url")),

      cv_url: trimOrNull(formData.get("cv_url")),
      tech_tags: tags,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Invalid form data.",
      errors: {},
      fields: {},
    };
  }

  const parsed = settingsUpdateSchema.safeParse(raw);
  if (!parsed.success) return validationErrorState(raw, parsed);

  const data = parsed.data;

  try {
    await sql`
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
        ${data.display_name},
        ${data.location},
        ${data.public_email},
        ${data.hero_headline},
        ${data.hero_bio},
        ${data.github_url ?? null},
        ${data.linkedin_url ?? null},
        ${data.cv_url ?? null},
        ${JSON.stringify(data.tech_tags)}::jsonb
      )
      ON CONFLICT (singleton_key) DO UPDATE
      SET
        display_name = EXCLUDED.display_name,
        location = EXCLUDED.location,
        public_email = EXCLUDED.public_email,
        hero_headline = EXCLUDED.hero_headline,
        hero_bio = EXCLUDED.hero_bio,
        github_url = EXCLUDED.github_url,
        linkedin_url = EXCLUDED.linkedin_url,
        cv_url = EXCLUDED.cv_url,
        tech_tags = EXCLUDED.tech_tags
    `;
  } catch (error) {
    const setupMessage = setupMessageFromError(error);
    if (setupMessage) {
      return { ok: false, message: setupMessage, errors: {}, fields: raw };
    }

    console.error("Failed to update settings", error);
    return {
      ok: false,
      message: "Unable to update settings. Please try again.",
      errors: {},
      fields: raw,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");

  return {
    ok: true,
    message: "Settings updated successfully.",
    errors: {},
    fields: raw,
  };
}
