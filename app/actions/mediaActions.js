"use server";

import { revalidatePath } from "next/cache";

import { sql } from "@/app/lib/db";
import { requireAdmin } from "@/app/lib/adminSession";
import { mediaAssetSchema } from "@/app/lib/schema";

function toErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong.";
}

function clampLimit(limit, { min = 1, max = 500, fallback = 200 } = {}) {
  const value = Number(limit);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(value)));
}

function normalizeMediaAssetInput(input) {
  return {
    type: input?.type === "video" ? "video" : "image",
    url: String(input?.url ?? "").trim(),
    poster_url: input?.poster_url ? String(input.poster_url).trim() : null,
    alt: input?.alt ? String(input.alt).trim() : null,
    caption: input?.caption ? String(input.caption).trim() : null,
  };
}

function isMissingMediaAssetsTable(error) {
  const message = String(error instanceof Error ? error.message : error);
  return message.includes('relation "media_assets" does not exist');
}

function isMissingProjectsTables(error) {
  const message = String(error instanceof Error ? error.message : error);
  return (
    message.includes('relation "projects" does not exist') ||
    message.includes('relation "project_media" does not exist')
  );
}

export async function getMediaAssetsAdmin({ limit = 200 } = {}) {
  await requireAdmin();
  const safeLimit = clampLimit(limit, { fallback: 200 });

  try {
    const rows = await sql`
      SELECT id, type, url, poster_url, alt, caption
      FROM media_assets
      ORDER BY created_at DESC
      LIMIT ${safeLimit}
    `;

    return { ok: true, assets: rows, message: null };
  } catch (error) {
    if (isMissingMediaAssetsTable(error)) {
      return {
        ok: false,
        assets: [],
        message:
          "Media library table is missing. Apply app/lib/media.sql to your database.",
      };
    }

    return { ok: false, assets: [], message: toErrorMessage(error) };
  }
}

// Backfill any existing project media into the centralized media library.
// This is safe to run repeatedly (INSERT ... ON CONFLICT DO NOTHING).
export async function syncMediaAssetsFromProjectsAdmin() {
  await requireAdmin();

  try {
    await sql.transaction([
      sql`
        INSERT INTO media_assets (type, url)
        SELECT 'image', TRIM(hero_image_url)
        FROM projects
        WHERE NULLIF(TRIM(hero_image_url), '') IS NOT NULL
        ON CONFLICT (url) DO NOTHING
      `,
      sql`
        INSERT INTO media_assets (type, url, poster_url, alt, caption)
        SELECT
          type,
          TRIM(url),
          NULLIF(TRIM(poster_url), ''),
          NULLIF(TRIM(alt), ''),
          NULLIF(TRIM(caption), '')
        FROM project_media
        WHERE NULLIF(TRIM(url), '') IS NOT NULL
        ON CONFLICT (url) DO NOTHING
      `,
      sql`
        INSERT INTO media_assets (type, url)
        SELECT 'image', TRIM(poster_url)
        FROM project_media
        WHERE NULLIF(TRIM(poster_url), '') IS NOT NULL
        ON CONFLICT (url) DO NOTHING
      `,
    ]);

    revalidatePath("/admin/media");
    return { ok: true, message: null };
  } catch (error) {
    if (isMissingMediaAssetsTable(error)) {
      return {
        ok: false,
        message:
          "Media library table is missing. Apply app/lib/media.sql to your database.",
      };
    }

    if (isMissingProjectsTables(error)) {
      return {
        ok: false,
        message:
          "Projects tables are missing. Apply app/lib/projects.sql to your database.",
      };
    }

    return { ok: false, message: toErrorMessage(error) };
  }
}

export async function upsertMediaAssetAction(input) {
  await requireAdmin();

  const raw = normalizeMediaAssetInput(input);
  const parsed = mediaAssetSchema.safeParse(raw);

  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    const firstFieldError = Object.values(flattened.fieldErrors)
      .flat()
      .filter(Boolean)[0];

    return {
      ok: false,
      message: firstFieldError || "Invalid media asset.",
      asset: null,
    };
  }

  const data = parsed.data;

  try {
    const rows = await sql`
      INSERT INTO media_assets (
        type,
        url,
        poster_url,
        alt,
        caption
      )
      VALUES (
        ${data.type},
        ${data.url},
        ${data.poster_url ?? null},
        ${data.alt ?? null},
        ${data.caption ?? null}
      )
      ON CONFLICT (url) DO UPDATE
      SET
        type = EXCLUDED.type,
        poster_url = COALESCE(EXCLUDED.poster_url, media_assets.poster_url),
        alt = COALESCE(EXCLUDED.alt, media_assets.alt),
        caption = COALESCE(EXCLUDED.caption, media_assets.caption)
      RETURNING id, type, url, poster_url, alt, caption
    `;

    revalidatePath("/admin/media");

    return {
      ok: true,
      message: null,
      asset: rows?.[0] ?? null,
    };
  } catch (error) {
    if (isMissingMediaAssetsTable(error)) {
      return {
        ok: false,
        message:
          "Media library table is missing. Apply app/lib/media.sql to your database.",
        asset: null,
      };
    }

    return { ok: false, message: toErrorMessage(error), asset: null };
  }
}

export async function deleteMediaAssetAction(input) {
  await requireAdmin();

  const id = String(input?.id ?? "").trim();
  if (!id) {
    return { ok: false, message: "Missing media id." };
  }

  try {
    const rows = await sql`
      DELETE FROM media_assets
      WHERE id = ${id}
      RETURNING id
    `;

    if (!rows?.length) {
      return { ok: false, message: "Media not found." };
    }

    revalidatePath("/admin/media");

    return { ok: true, message: null };
  } catch (error) {
    if (isMissingMediaAssetsTable(error)) {
      return {
        ok: false,
        message:
          "Media library table is missing. Apply app/lib/media.sql to your database.",
      };
    }

    return { ok: false, message: toErrorMessage(error) };
  }
}
