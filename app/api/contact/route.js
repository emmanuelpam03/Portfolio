import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  message: z.string().trim().min(10, "Message is too short"),
});

export async function POST(req) {
  try {
    const json = await req.json();
    const parsed = contactSchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid form data",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      return Response.json(
        {
          success: false,
          message:
            "Server is missing WEB3FORMS_ACCESS_KEY env var. Add it to .env.",
        },
        { status: 500 },
      );
    }

    const formData = new FormData();
    formData.append("access_key", accessKey);
    formData.append("name", parsed.data.name);
    formData.append("email", parsed.data.email);
    formData.append("message", parsed.data.message);

    const upstream = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const upstreamJson = await upstream.json().catch(() => null);

    if (!upstream.ok || !upstreamJson?.success) {
      return Response.json(
        {
          success: false,
          message: upstreamJson?.message || "Failed to submit form",
        },
        { status: 502 },
      );
    }

    return Response.json({ success: true, message: "Submitted" });
  } catch {
    return Response.json(
      { success: false, message: "Invalid request" },
      { status: 400 },
    );
  }
}
