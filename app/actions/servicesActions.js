"use server";

import { revalidatePath } from "next/cache";

import { sql } from "@/app/lib/db";
import { requireAdmin } from "@/app/lib/adminSession";
import { servicesUpdateSchema } from "@/app/lib/schema";

function toErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong.";
}

function trimOrNull(value) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function checkboxToBoolean(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  return normalized === "on" || normalized === "true" || normalized === "1";
}

function isMissingServicesTables(error) {
  const message = String(error instanceof Error ? error.message : error);
  return (
    message.includes('relation "services" does not exist') ||
    message.includes('relation "services_content" does not exist')
  );
}

function setupMessageFromError(error) {
  if (isMissingServicesTables(error)) {
    return "Services tables are missing. Apply app/lib/services.sql to your database.";
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

function safeServicesFromJson(value) {
  const raw = String(value ?? "[]");
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid services JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid services JSON");
  }

  return parsed;
}

async function loadServicesContentRow() {
  const rows = await sql`
    SELECT
      is_enabled,
      kicker_text,
      heading_text,
      intro_text,
      show_cta,
      cta_title,
      cta_body,
      cta_button_text,
      cta_button_href
    FROM services_content
    WHERE singleton_key = 'default'
    LIMIT 1
  `;

  return rows?.[0] ?? null;
}

async function loadServicesRowsPublic() {
  const rows = await sql`
    SELECT
      id,
      title,
      description,
      icon_key,
      link_url,
      sort_order,
      is_active
    FROM services
    WHERE is_active = true
    ORDER BY sort_order ASC, created_at ASC
  `;

  return Array.isArray(rows) ? rows : [];
}

async function loadServicesRowsAdmin() {
  const rows = await sql`
    SELECT
      id,
      title,
      description,
      icon_key,
      link_url,
      sort_order,
      is_active
    FROM services
    ORDER BY sort_order ASC, created_at ASC
  `;

  return Array.isArray(rows) ? rows : [];
}

function normalizeServicesContentRow(row) {
  if (!row) return null;

  return {
    is_enabled: Boolean(row?.is_enabled),
    kicker_text: row?.kicker_text ? String(row.kicker_text) : "",
    heading_text: row?.heading_text ? String(row.heading_text) : "",
    intro_text: row?.intro_text ? String(row.intro_text) : "",

    show_cta: Boolean(row?.show_cta),
    cta_title: row?.cta_title ? String(row.cta_title) : "",
    cta_body: row?.cta_body ? String(row.cta_body) : "",
    cta_button_text: row?.cta_button_text ? String(row.cta_button_text) : "",
    cta_button_href: row?.cta_button_href ? String(row.cta_button_href) : "",
  };
}

function normalizeServicesRows(rows) {
  const list = Array.isArray(rows) ? rows : [];

  return list
    .map((row) => ({
      id: row?.id ? String(row.id) : "",
      title: row?.title ? String(row.title) : "",
      description: row?.description ? String(row.description) : "",
      icon_key: row?.icon_key ? String(row.icon_key) : "",
      link_url: row?.link_url ? String(row.link_url) : null,
      sort_order: Number(row?.sort_order ?? 0),
      is_active: Boolean(row?.is_active),
    }))
    .filter((row) => row.title && row.description && row.icon_key);
}

export async function getServicesPublic() {
  try {
    const [contentRow, servicesRows] = await Promise.all([
      loadServicesContentRow(),
      loadServicesRowsPublic(),
    ]);

    return {
      ok: true,
      content: normalizeServicesContentRow(contentRow),
      services: normalizeServicesRows(servicesRows),
      message: null,
    };
  } catch (error) {
    const setupMessage = setupMessageFromError(error);
    if (setupMessage) {
      return { ok: false, content: null, services: [], message: setupMessage };
    }

    console.error("Failed to load public services", error);
    return {
      ok: false,
      content: null,
      services: [],
      message: toErrorMessage(error),
    };
  }
}

export async function getServicesAdmin() {
  await requireAdmin();

  try {
    const [contentRow, servicesRows] = await Promise.all([
      loadServicesContentRow(),
      loadServicesRowsAdmin(),
    ]);

    return {
      ok: true,
      content: normalizeServicesContentRow(contentRow),
      services: normalizeServicesRows(servicesRows),
      message: null,
    };
  } catch (error) {
    const setupMessage = setupMessageFromError(error);
    if (setupMessage) {
      return { ok: false, content: null, services: [], message: setupMessage };
    }

    console.error("Failed to load admin services", error);
    return {
      ok: false,
      content: null,
      services: [],
      message: toErrorMessage(error),
    };
  }
}

export async function updateServicesAction(_prevState, formData) {
  await requireAdmin();

  let servicesJson;
  try {
    servicesJson = safeServicesFromJson(formData.get("services_json"));
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Invalid form data.",
      errors: {},
      fields: {},
    };
  }

  const raw = {
    is_enabled: checkboxToBoolean(formData.get("is_enabled")),
    kicker_text: String(formData.get("kicker_text") ?? ""),
    heading_text: String(formData.get("heading_text") ?? ""),
    intro_text: String(formData.get("intro_text") ?? ""),

    show_cta: checkboxToBoolean(formData.get("show_cta")),
    cta_title: String(formData.get("cta_title") ?? ""),
    cta_body: String(formData.get("cta_body") ?? ""),
    cta_button_text: String(formData.get("cta_button_text") ?? ""),
    cta_button_href: String(formData.get("cta_button_href") ?? ""),

    services: servicesJson.map((item) => ({
      title: String(item?.title ?? ""),
      description: String(item?.description ?? ""),
      icon_key: String(item?.icon_key ?? ""),
      link_url: trimOrNull(item?.link_url),
      is_active: Boolean(item?.is_active ?? true),
    })),
  };

  const parsed = servicesUpdateSchema.safeParse(raw);
  if (!parsed.success) return validationErrorState(raw, parsed);

  const data = parsed.data;

  const transactionQueries = [
    sql`
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
        ${data.is_enabled},
        ${data.kicker_text},
        ${data.heading_text},
        ${data.intro_text},
        ${data.show_cta},
        ${data.cta_title},
        ${data.cta_body},
        ${data.cta_button_text},
        ${data.cta_button_href}
      )
      ON CONFLICT (singleton_key) DO UPDATE
      SET
        is_enabled = EXCLUDED.is_enabled,
        kicker_text = EXCLUDED.kicker_text,
        heading_text = EXCLUDED.heading_text,
        intro_text = EXCLUDED.intro_text,
        show_cta = EXCLUDED.show_cta,
        cta_title = EXCLUDED.cta_title,
        cta_body = EXCLUDED.cta_body,
        cta_button_text = EXCLUDED.cta_button_text,
        cta_button_href = EXCLUDED.cta_button_href
    `,
    sql`
      DELETE FROM services
    `,
    ...data.services.map(
      (service, index) => sql`
        INSERT INTO services (
          title,
          description,
          icon_key,
          link_url,
          is_active,
          sort_order
        )
        VALUES (
          ${service.title},
          ${service.description},
          ${service.icon_key},
          ${service.link_url ?? null},
          ${service.is_active},
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
      return { ok: false, message: setupMessage, errors: {}, fields: raw };
    }

    console.error("Failed to update services", error);
    return {
      ok: false,
      message: "Unable to update Services. Please try again.",
      errors: {},
      fields: raw,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/services");

  return {
    ok: true,
    message: "Services updated successfully.",
    errors: {},
    fields: raw,
  };
}
