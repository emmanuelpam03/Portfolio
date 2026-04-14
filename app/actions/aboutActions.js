"use server";

import { revalidatePath } from "next/cache";

import { sql } from "@/app/lib/db";
import { requireAdmin } from "@/app/lib/adminSession";
import { aboutUpdateSchema } from "@/app/lib/schema";

function toErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong.";
}

function normalizeUuidOrNull(value) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function isMissingAboutTables(error) {
  const message = String(error instanceof Error ? error.message : error);
  return (
    message.includes('relation "about_content" does not exist') ||
    message.includes('relation "about_cards" does not exist') ||
    message.includes('relation "about_tools" does not exist')
  );
}

function isMissingMediaAssetsTable(error) {
  const message = String(error instanceof Error ? error.message : error);
  return message.includes('relation "media_assets" does not exist');
}

function setupMessageFromError(error) {
  if (isMissingMediaAssetsTable(error)) {
    return "Media library table is missing. Apply app/lib/media.sql to your database.";
  }
  if (isMissingAboutTables(error)) {
    return "About tables are missing. Apply app/lib/about.sql to your database.";
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

function safeCardsFromJson(value) {
  const raw = String(value ?? "[]");
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid cards JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid cards JSON");
  }

  return parsed;
}

function safeToolsFromJson(value) {
  const raw = String(value ?? "[]");
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid tools JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid tools JSON");
  }

  return parsed;
}

function dedupeToolsPreserveOrder(tools) {
  const seen = new Set();
  const next = [];

  for (const tool of tools) {
    const id = String(tool?.media_asset_id ?? "").trim();
    if (!id) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    next.push({ media_asset_id: id });
  }

  return next;
}

async function loadAboutRow() {
  const rows = await sql`
    SELECT
      c.singleton_key,
      c.about_text,
      c.hero_image_asset_id,
      hero.url AS hero_image_url,
      hero.alt AS hero_image_alt,
      c.about_image_asset_id,
      about_img.url AS about_image_url,
      about_img.alt AS about_image_alt
    FROM about_content c
    LEFT JOIN media_assets hero ON hero.id = c.hero_image_asset_id
    LEFT JOIN media_assets about_img ON about_img.id = c.about_image_asset_id
    WHERE c.singleton_key = 'default'
    LIMIT 1
  `;

  return rows?.[0] ?? null;
}

async function loadAboutCards() {
  const rows = await sql`
    SELECT id, title, description, icon_key, sort_order
    FROM about_cards
    WHERE about_key = 'default'
    ORDER BY sort_order ASC, created_at ASC
  `;

  return Array.isArray(rows) ? rows : [];
}

async function loadAboutToolsWithAssets() {
  const rows = await sql`
    SELECT
      t.id,
      t.media_asset_id,
      t.sort_order,
      a.url,
      a.alt
    FROM about_tools t
    JOIN media_assets a ON a.id = t.media_asset_id
    WHERE t.about_key = 'default'
    ORDER BY t.sort_order ASC, t.created_at ASC
  `;

  return Array.isArray(rows) ? rows : [];
}

function normalizeAboutResult({ contentRow, cardsRows, toolsRows }) {
  const aboutText = contentRow?.about_text ? String(contentRow.about_text) : "";

  const heroImage =
    contentRow?.hero_image_asset_id && contentRow?.hero_image_url
      ? {
          id: String(contentRow.hero_image_asset_id),
          url: String(contentRow.hero_image_url),
          alt: contentRow.hero_image_alt
            ? String(contentRow.hero_image_alt)
            : "",
        }
      : null;

  const aboutImage =
    contentRow?.about_image_asset_id && contentRow?.about_image_url
      ? {
          id: String(contentRow.about_image_asset_id),
          url: String(contentRow.about_image_url),
          alt: contentRow.about_image_alt
            ? String(contentRow.about_image_alt)
            : "",
        }
      : null;

  const cards = (Array.isArray(cardsRows) ? cardsRows : [])
    .map((row) => ({
      id: String(row?.id ?? ""),
      title: String(row?.title ?? ""),
      description: String(row?.description ?? ""),
      icon_key: row?.icon_key ? String(row.icon_key) : null,
      sort_order: Number(row?.sort_order ?? 0),
    }))
    .filter((row) => row.title && row.description);

  const tools = (Array.isArray(toolsRows) ? toolsRows : [])
    .map((row) => ({
      id: String(row?.id ?? ""),
      media_asset_id: String(row?.media_asset_id ?? ""),
      sort_order: Number(row?.sort_order ?? 0),
      url: String(row?.url ?? ""),
      alt: row?.alt ? String(row.alt) : "",
    }))
    .filter((row) => row.media_asset_id && row.url);

  return {
    about_text: aboutText,
    hero_image: heroImage,
    about_image: aboutImage,
    cards,
    tools,
  };
}

export async function getAboutPublic() {
  try {
    const [contentRow, cardsRows, toolsRows] = await Promise.all([
      loadAboutRow(),
      loadAboutCards(),
      loadAboutToolsWithAssets(),
    ]);

    const about = normalizeAboutResult({ contentRow, cardsRows, toolsRows });

    return { ok: true, about, message: null };
  } catch (error) {
    const setupMessage = setupMessageFromError(error);
    if (setupMessage) {
      return { ok: false, about: null, message: setupMessage };
    }

    console.error("Failed to load public about", error);
    return { ok: false, about: null, message: toErrorMessage(error) };
  }
}

export async function getAboutAdmin() {
  await requireAdmin();

  try {
    const [contentRow, cardsRows, toolsRows] = await Promise.all([
      loadAboutRow(),
      loadAboutCards(),
      loadAboutToolsWithAssets(),
    ]);

    const about = normalizeAboutResult({ contentRow, cardsRows, toolsRows });

    return { ok: true, about, message: null };
  } catch (error) {
    const setupMessage = setupMessageFromError(error);
    if (setupMessage) {
      return { ok: false, about: null, message: setupMessage };
    }

    console.error("Failed to load admin about", error);
    return { ok: false, about: null, message: toErrorMessage(error) };
  }
}

export async function updateAboutAction(_prevState, formData) {
  await requireAdmin();

  let raw;
  try {
    const cards = safeCardsFromJson(formData.get("cards_json"));
    const tools = safeToolsFromJson(formData.get("tools_json"));

    raw = {
      about_text: String(formData.get("about_text") ?? ""),
      hero_image_asset_id: normalizeUuidOrNull(
        formData.get("hero_image_asset_id"),
      ),
      about_image_asset_id: normalizeUuidOrNull(
        formData.get("about_image_asset_id"),
      ),
      cards: cards.map((card) => ({
        title: String(card?.title ?? ""),
        description: String(card?.description ?? ""),
        icon_key: card?.icon_key == null ? null : String(card.icon_key),
      })),
      tools: dedupeToolsPreserveOrder(tools),
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Invalid form data.",
      errors: {},
      fields: {},
    };
  }

  const parsed = aboutUpdateSchema.safeParse(raw);

  if (!parsed.success) {
    return validationErrorState(raw, parsed);
  }

  const data = parsed.data;

  const transactionQueries = [
    sql`
      INSERT INTO about_content (
        singleton_key,
        about_text,
        hero_image_asset_id,
        about_image_asset_id
      )
      VALUES (
        'default',
        ${data.about_text},
        ${data.hero_image_asset_id ?? null},
        ${data.about_image_asset_id ?? null}
      )
      ON CONFLICT (singleton_key) DO UPDATE
      SET
        about_text = EXCLUDED.about_text,
        hero_image_asset_id = EXCLUDED.hero_image_asset_id,
        about_image_asset_id = EXCLUDED.about_image_asset_id
    `,
    sql`
      DELETE FROM about_cards
      WHERE about_key = 'default'
    `,
    ...data.cards.map(
      (card, index) =>
        sql`
        INSERT INTO about_cards (
          about_key,
          title,
          description,
          icon_key,
          sort_order
        )
        VALUES (
          'default',
          ${card.title},
          ${card.description},
          ${card.icon_key ?? null},
          ${index}
        )
      `,
    ),
    sql`
      DELETE FROM about_tools
      WHERE about_key = 'default'
    `,
    ...data.tools.map(
      (tool, index) =>
        sql`
        INSERT INTO about_tools (
          about_key,
          media_asset_id,
          sort_order
        )
        VALUES (
          'default',
          ${tool.media_asset_id},
          ${index}
        )
      `,
    ),
  ];

  try {
    await sql.transaction(transactionQueries);
  } catch (error) {
    const setupMessage = setupMessageFromError(error);
    if (setupMessage) {
      return {
        ok: false,
        message: setupMessage,
        errors: {},
        fields: raw,
      };
    }

    console.error("Failed to update about", error);
    return {
      ok: false,
      message: "Unable to update About. Please try again.",
      errors: {},
      fields: raw,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/about");

  return {
    ok: true,
    message: "About updated successfully.",
    errors: {},
    fields: raw,
  };
}
