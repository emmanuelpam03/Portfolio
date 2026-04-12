"use server";

import { sql } from "@/app/lib/db";
import { requireAdmin } from "@/app/lib/adminSession";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
const session = await getAdminSession();

// generate slug
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");
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
// Get all projects for admin (including unpublished)
export async function getAllProjectsAdmin() {
  await requireAdmin();
  const projects = await sql`
    SELECT id, slug, title, description, image_url, is_published, is_featured, created_at, updated_at
    FROM projects
    ORDER BY created_at DESC
  `;
  return projects;
}

// Get all Published Projects
export async function getPublishedProjects() {
  const projects = await sql`
    SELECT id, slug, title, description, image_url, created_at, updated_at
    FROM projects
    WHERE is_published = true
    ORDER BY created_at DESC
  `;
  return projects;
}

// Get all Published Featured Projects
export async function getFeaturedProjects(limit = 10) {
  const projects = await sql`
    SELECT id, slug, title, description, image_url, created_at
    FROM projects
    WHERE is_published = true AND is_featured = true
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return projects;
}

// Get Project by Slug
export async function getProjectBySlug(slug) {
  const projects = await sql`
    SELECT id, slug, title, description, image_url, created_at, updated_at
    FROM projects
    WHERE slug = ${slug} AND is_published = true
  `;

  if (projects.length === 0) return notFound();

  return projects;
}

// Get Project by ID (for admin editing) - includes unpublished projects
export async function getProjectById(id) {
  await requireAdmin();
  const projects = await sql`
  SELECT id, slug, title, description, image_url, created_at, updated_at
  FROM projects
  WHERE id = ${id}
`;

  if (projects.length === 0) return notFound();

  return projects[0];
}

// Create a new project
export async function createProject(data) {
  // admin check
  await requireAdmin();

  const parsed = projectSchema.safeParse(data);

  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    throw new Error(
      "Validation failed: " + JSON.stringify(flattened.fieldErrors),
    );
  }

  const {
    title,
    description,
    image_url,
    project_live_url,
    project_github_url,
    is_published,
    is_featured,
  } = data;

  // Basic validation
  if (!title || !description || !image_url || !project_github_url) {
    throw new Error("Missing required fields");
  }

  const baseSlug = slugify(title);
  const slug = await generateUniqueSlug(baseSlug);

  const project = await sql`
    INSERT INTO projects (
      slug, 
      title, 
      description, 
      image_url, 
      project_live_url, 
      project_github_url, 
      is_published, 
      is_featured
    )
    VALUES (
      ${slug}, 
      ${title}, 
      ${description}, 
      ${image_url}, 
      ${project_live_url ?? null}, 
      ${project_github_url}, 
      ${is_published ?? false}, 
      ${is_featured ?? false}
    )
    RETURNING id
  `;

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/${slug}");

  return project[0].id;
}

// Update an existing project
export async function updateProject(id, data) {
  // require admin
  await requireAdmin();

  const parsed = projectSchema.partial().safeParse(data);

  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    throw new Error(
      "Validation failed: " + JSON.stringify(flattened.fieldErrors),
    );
  }

  const {
    title,
    description,
    image_url,
    project_live_url,
    project_github_url,
    is_published,
    is_featured,
  } = data;

  if (
    title === undefined ||
    description === undefined ||
    image_url === undefined ||
    project_github_url === undefined
  ) {
    throw new Error("Missing required fields");
  }

  let nextIsPublished = is_published;
  let nextIsFeatured = is_featured;

  if (nextIsPublished === undefined || nextIsFeatured === undefined) {
    const existing = await sql`
      SELECT is_published, is_featured
      FROM projects
      WHERE id = ${id}
    `;

    if (existing.length === 0) {
      throw new Error("Project not found");
    }

    if (nextIsPublished === undefined) {
      nextIsPublished = existing[0].is_published;
    }

    if (nextIsFeatured === undefined) {
      nextIsFeatured = existing[0].is_featured;
    }
  }

  const project = await sql`
      UPDATE projects
      SET title = ${title}, 
      description = ${description}, 
      image_url = ${image_url}, 
      project_live_url = ${project_live_url ?? null}, 
      project_github_url = ${project_github_url}, 
      is_published = ${nextIsPublished}, 
      is_featured = ${nextIsFeatured}
    WHERE id = ${id}
    RETURNING id
  `;

  if (project.length === 0) {
    throw new Error("Project not found");
  }

  return project[0].id;
}
// Delete a project
export async function deleteProject(id) {
  await requireAdmin();
  const project = await sql`
  DELETE FROM projects
  WHERE id = ${id}
  RETURNING id
`;

  if (project.length === 0) {
    throw new Error("Project not found");
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/${project[0].slug}");

  return true;
}
