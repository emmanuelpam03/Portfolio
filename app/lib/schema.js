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

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image_url: z.string().url(),
  project_live_url: z.string().url().optional().nullable(),
  project_github_url: z.string().url(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});