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

  cards: z
    .array(aboutCardSchema)
    .length(3, "About must have exactly 3 cards")
    .default([]),

  tools: z.array(aboutToolSchema).default([]),
});
