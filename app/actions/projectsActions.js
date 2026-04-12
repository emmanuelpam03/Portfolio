"use server";

import { sql } from "@/app/lib/db";
import { notFound } from "next/navigation";

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
  const projects = await sql`
  SELECT id, slug, title, description, image_url, created_at, updated_at
  FROM projects
  WHERE id = ${id}
`;

  if (projects.length === 0) return notFound();

  return projects[0];
}
return projects;

// Create a new project
export async function createProject(data) {
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
  return project[0].id;
}

// Update an existing project
export async function updateProject(id, data) {
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

  const project = await sql`
      UPDATE projects
      SET title = ${title}, 
      description = ${description}, 
      image_url = ${image_url}, 
      project_live_url = ${project_live_url ?? null}, 
      project_github_url = ${project_github_url}, 
      is_published = ${is_published ?? false}, 
      is_featured = ${is_featured ?? false}
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
  await sql`
    DELETE FROM projects
    WHERE id = ${id}
  `;
  return true;
}
