"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
});

export async function submitContact(prevState, formData) {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fields: raw,
      errors: flattened.fieldErrors,
    };
  }

  // Frontend-only phase: no sending yet. When you're ready, we can forward
  // this to an email provider (Resend) or Web3Forms from here.
  return {
    success: true,
    message: "Form Submitted Successfully",
    fields: { name: "", email: "", message: "" },
    errors: {},
  };
}
