import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
});

// Project Schema for Admin CRUD operations

export const projectMediaSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url("Enter a valid media URL"),
  poster_url: z.string().url("Enter a valid poster URL").optional().nullable(),
  alt: z.string().trim().min(1, "Alt text is required").max(200),
  caption: z.string().trim().max(500).optional().nullable(),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000, "Description must not exceed 5000 characters"),
  hero_image_url: z.string().url("Enter a valid hero image URL"),
  project_live_url: z
    .string()
    .url("Enter a valid live URL")
    .optional()
    .nullable(),
  project_github_url: z
    .string()
    .url("Enter a valid GitHub URL")
    .refine(
      (value) => value.startsWith("https://github.com/"),
      "GitHub URL must start with https://github.com/",
    ),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export const projectWithMediaSchema = projectSchema.extend({
  media: z.array(projectMediaSchema).default([]),
});

// Media Library Schema (centralized media assets)

export const mediaAssetSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url("Enter a valid media URL"),
  poster_url: z.string().url("Enter a valid poster URL").optional().nullable(),
  alt: z.string().trim().min(1, "Alt text is required").max(200),
  caption: z.string().trim().max(500).optional().nullable(),
});

// About Schemas

export const aboutCardSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(1000),
  icon_key: z.string().trim().max(60).optional().nullable(),
});

export const aboutToolSchema = z.object({
  media_asset_id: z.string().trim().uuid("Select a valid media asset"),
});

export const aboutUpdateSchema = z.object({
  about_text: z
    .string()
    .trim()
    .min(1, "About text is required")
    .max(5000, "About text must not exceed 5000 characters"),

  hero_image_asset_id: z.string().trim().uuid().optional().nullable(),
  about_image_asset_id: z.string().trim().uuid().optional().nullable(),

  cards: z.array(aboutCardSchema).length(3, "About must have exactly 3 cards"),
  tools: z.array(aboutToolSchema).default([]),
  hero_languages: z.array(aboutToolSchema).default([]),
});

// Settings Schemas

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const relativeOrHttpUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      (value.startsWith("/") && !value.startsWith("//")) || isHttpUrl(value),
    "Enter a valid URL (https://...) or a path like /resume.pdf",
  );

export const settingsUpdateSchema = z.object({
  display_name: z.string().trim().min(1, "Display name is required").max(120),
  location: z.string().trim().min(1, "Location is required").max(120),
  public_email: z.string().trim().email("Enter a valid email").max(120),

  hero_headline: z.string().trim().min(1, "Hero headline is required").max(160),

  hero_bio: z.string().trim().min(1, "Bio is required").max(2000),

  github_url: z
    .string()
    .trim()
    .url("Enter a valid GitHub URL")
    .refine(
      (value) => value.startsWith("https://github.com/"),
      "GitHub URL must start with https://github.com/",
    )
    .optional()
    .nullable(),

  linkedin_url: z
    .string()
    .trim()
    .url("Enter a valid LinkedIn URL e.g. https://linkedin.com/in/yourprofile")
    .refine(
      (value) =>
        value.startsWith("https://www.linkedin.com/") ||
        value.startsWith("https://linkedin.com/"),
      "LinkedIn URL must start with https://linkedin.com/",
    )
    .optional()
    .nullable(),

  cv_url: relativeOrHttpUrlSchema.optional().nullable(),
});

// Services Schemas

const hrefOrAnchorSchema = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) =>
      (value.startsWith("#") && value.length > 1) ||
      (value.startsWith("/") && !value.startsWith("//")) ||
      isHttpUrl(value),
    "Enter a valid URL (https://...), a path like /services, or an anchor like #contact",
  );

export const serviceItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(1000),
  icon_key: z
    .string()
    .trim()
    .min(1, "Icon name is required")
    .max(60)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use a Lucide icon name in kebab-case (e.g. globe, code-2, shield-check)",
    ),
  icon_url: z
    .string()
    .trim()
    .url("Enter a valid icon URL")
    .max(2048)
    .optional()
    .nullable(),
  link_url: hrefOrAnchorSchema.optional().nullable(),
  is_active: z.boolean(),
});

export const servicesUpdateSchema = z.object({
  is_enabled: z.boolean(),

  kicker_text: z.string().trim().min(1, "Kicker text is required").max(80),
  heading_text: z.string().trim().min(1, "Heading is required").max(160),
  intro_text: z.string().trim().min(1, "Intro text is required").max(2000),

  show_cta: z.boolean(),
  cta_title: z.string().trim().min(1, "CTA title is required").max(160),
  cta_body: z.string().trim().min(1, "CTA body is required").max(2000),
  cta_button_text: z
    .string()
    .trim()
    .min(1, "CTA button text is required")
    .max(80),
  cta_button_href: hrefOrAnchorSchema,

  services: z.array(serviceItemSchema).default([]),
});
