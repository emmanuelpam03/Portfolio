"use server";

import crypto from "crypto";
import { sql } from "@/app/lib/db";
import { requireAdmin } from "@/app/lib/adminSession";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { projectWithMediaSchema } from "@/app/lib/schema";

// generate slug
function slugify(title) {
  const base = String(title ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return base || "project";
}

// Ensure slug is unique by checking against the database. If it exists, append a short random string.
async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const existing = await sql`
      SELECT id FROM projects WHERE slug = ${slug}
    `;
    if (existing.length === 0) {
      return slug;
    }
    slug = `${baseSlug}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    attempts++;
  }

  throw new Error("Unable to generate unique slug");
}

function trimOrNull(value) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function checkboxToBoolean(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "on" || normalized === "true" || normalized === "1";
}

function normalizeMediaItem(item) {
  const type = item?.type === "video" ? "video" : "image";
  return {
    type,
    url: String(item?.url ?? "").trim(),
    poster_url: trimOrNull(item?.poster_url),
    alt: trimOrNull(item?.alt),
    caption: trimOrNull(item?.caption),
  };
}

function parseProjectFormData(formData) {
  const rawMediaJson = String(formData.get("media_json") ?? "[]");
  let mediaParsed = [];

  try {
    const parsed = JSON.parse(rawMediaJson);
    mediaParsed = Array.isArray(parsed) ? parsed : [];
  } catch {
    throw new Error("Invalid media JSON");
  }

  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    hero_image_url: String(formData.get("hero_image_url") ?? "").trim(),
    project_live_url: trimOrNull(formData.get("project_live_url")),
    project_github_url: String(formData.get("project_github_url") ?? "").trim(),
    is_published: checkboxToBoolean(formData.get("is_published")),
    is_featured: checkboxToBoolean(formData.get("is_featured")),
    media: mediaParsed.map(normalizeMediaItem),
  };
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

// Get all projects for admin (including unpublished)
export async function getAllProjectsAdmin() {
  await requireAdmin();
  const projects = await sql`
    SELECT id, slug, title, description, hero_image_url, is_published, is_featured, created_at, updated_at
    FROM projects
    ORDER BY created_at DESC
  `;
  return projects;
}

// Get all Published Projects
export async function getPublishedProjects() {
  const projects = await sql`
    SELECT id, slug, title, description, hero_image_url, created_at, updated_at
    FROM projects
    WHERE is_published = true
    ORDER BY created_at DESC
  `;
  return projects;
}

// Get all Published Featured Projects
export async function getFeaturedProjects(limit = 10) {
  const projects = await sql`
    SELECT id, slug, title, description, hero_image_url, created_at
    FROM projects
    WHERE is_published = true AND is_featured = true
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return projects;
}

async function getProjectWithMediaById(projectId) {
  const media = await sql`
    SELECT id, type, url, poster_url, alt, caption, sort_order, created_at
    FROM project_media
    WHERE project_id = ${projectId}
    ORDER BY sort_order ASC, created_at ASC
  `;
  return media;
}

// Get Project by Slug (published only) + media
export async function getProjectBySlug(slug) {
  const projects = await sql`
    SELECT id, slug, title, description, hero_image_url, project_live_url, project_github_url, is_published, is_featured, created_at, updated_at
    FROM projects
    WHERE slug = ${slug} AND is_published = true
    LIMIT 1
  `;

  if (!projects.length) return notFound();

  const project = projects[0];
  const media = await getProjectWithMediaById(project.id);
  return { ...project, media };
}

// Get Project by Slug for admin (includes unpublished) + media
export async function getProjectBySlugAdmin(slug) {
  await requireAdmin();
  const projects = await sql`
    SELECT id, slug, title, description, hero_image_url, project_live_url, project_github_url, is_published, is_featured, created_at, updated_at
    FROM projects
    WHERE slug = ${slug}
    LIMIT 1
  `;

  if (!projects.length) return notFound();

  const project = projects[0];
  const media = await getProjectWithMediaById(project.id);
  return { ...project, media };
}

export async function createProjectAction(_prevState, formData) {
  await requireAdmin();

  let raw;
  try {
    raw = parseProjectFormData(formData);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Invalid form data.",
      errors: {},
      fields: {},
    };
  }

  const parsed = projectWithMediaSchema.safeParse(raw);

  if (!parsed.success) {
    return validationErrorState(raw, parsed);
  }

  const data = parsed.data;

  const baseSlug = slugify(data.title);
  const slug = await generateUniqueSlug(baseSlug);

  const projectId = crypto.randomUUID();

  const transactionQueries = [
    sql`
      INSERT INTO projects (
        id,
        slug,
        title,
        description,
        hero_image_url,
        project_live_url,
        project_github_url,
        is_published,
        is_featured
      )
      VALUES (
        ${projectId},
        ${slug},
        ${data.title},
        ${data.description},
        ${data.hero_image_url},
        ${data.project_live_url ?? null},
        ${data.project_github_url},
        ${data.is_published ?? false},
        ${data.is_featured ?? false}
      )
    `,
    ...data.media.map((item, index) =>
      sql`
        INSERT INTO project_media (
          project_id,
          type,
          url,
          poster_url,
          alt,
          caption,
          sort_order
        )
        VALUES (
          ${projectId},
          ${item.type},
          ${item.url},
          ${item.poster_url ?? null},
          ${item.alt ?? null},
          ${item.caption ?? null},
          ${index}
        )
      `,
    ),
  ];

  await sql.transaction(transactionQueries);

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");

  redirect(`/admin/projects/${slug}`);
}

export async function updateProjectAction(prevState, formData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return {
      ok: false,
      message: "Missing project id.",
      errors: {},
      fields: prevState?.fields ?? {},
    };
  }

  let raw;
  try {
    raw = parseProjectFormData(formData);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Invalid form data.",
      errors: {},
      fields: prevState?.fields ?? {},
    };
  }

  const parsed = projectWithMediaSchema.safeParse(raw);

  if (!parsed.success) {
    return validationErrorState(raw, parsed);
  }

  const data = parsed.data;

  const transactionQueries = [
    sql`
      UPDATE projects
      SET
        title = ${data.title},
        description = ${data.description},
        hero_image_url = ${data.hero_image_url},
        project_live_url = ${data.project_live_url ?? null},
        project_github_url = ${data.project_github_url},
        is_published = ${data.is_published ?? false},
        is_featured = ${data.is_featured ?? false}
      WHERE id = ${id}
      RETURNING slug
    `,
    sql`
      DELETE FROM project_media
      WHERE project_id = ${id}
    `,
    ...data.media.map((item, index) =>
      sql`
        INSERT INTO project_media (
          project_id,
          type,
          url,
          poster_url,
          alt,
          caption,
          sort_order
        )
        VALUES (
          ${id},
          ${item.type},
          ${item.url},
          ${item.poster_url ?? null},
          ${item.alt ?? null},
          ${item.caption ?? null},
          ${index}
        )
      `,
    ),
  ];

  const results = await sql.transaction(transactionQueries);
  const updatedRows = results?.[0] ?? [];
  if (!updatedRows.length) {
    return {
      ok: false,
      message: "Project not found.",
      errors: {},
      fields: raw,
    };
  }

  const slug = updatedRows[0].slug;

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${slug}`);

  return {
    ok: true,
    message: "Saved.",
    errors: {},
    fields: raw,
  };
}

// Delete a project (cascades media)
export async function deleteProjectAction(formData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Missing project id");
  }

  const deleted = await sql`
    DELETE FROM projects
    WHERE id = ${id}
    RETURNING slug
  `;

  if (!deleted.length) {
    throw new Error("Project not found");
  }

  const slug = deleted[0].slug;

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");

  redirect("/admin/projects");
}
