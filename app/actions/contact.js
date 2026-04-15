"use server";

import { contactSchema } from "@/app/lib/schema";
import { Resend } from "resend";
import { getSettingsPublic } from "@/app/actions/settingsActions";

function trimOrNull(value) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

async function getContactDestinationEmail() {
  let settingsResult;

  try {
    settingsResult = await getSettingsPublic();
  } catch (error) {
    console.error("Failed to load public settings", error);
    return { email: null, message: "Unable to load site settings." };
  }

  const email = trimOrNull(settingsResult?.settings?.public_email);
  const message =
    typeof settingsResult?.message === "string" && settingsResult.message.trim()
      ? settingsResult.message.trim()
      : null;

  return { email, message };
}

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

  const resendApiKey = trimOrNull(process.env.RESEND_API_KEY);
  const resendFrom = trimOrNull(process.env.RESEND_FROM);

  if (!resendApiKey || !resendFrom) {
    return {
      success: false,
      message:
        "Contact form is not configured yet. Set RESEND_API_KEY and RESEND_FROM.",
      fields: raw,
      errors: {},
    };
  }

  const { email: toEmail, message: settingsMessage } =
    await getContactDestinationEmail();

  if (!toEmail) {
    return {
      success: false,
      message:
        settingsMessage ||
        "Contact destination email is not configured. Set Public Email in Admin → Settings.",
      fields: raw,
      errors: {},
    };
  }

  const resend = new Resend(resendApiKey);

  const safeName = String(parsed.data.name)
    .replace(/[\r\n]+/g, " ")
    .trim();
  const subjectName = safeName.length ? safeName : "New message";
  const from = resendFrom.includes("<")
    ? resendFrom
    : `Portfolio <${resendFrom}>`;

  try {
    const result = await resend.emails.send({
      from,
      to: toEmail,
      replyTo: parsed.data.email,
      subject: `Portfolio contact: ${subjectName}`,
      text: `New message from your portfolio contact form\n\nName: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\nMessage:\n${parsed.data.message}`,
    });

    if (result?.error) {
      console.error("Resend rejected contact email", result.error);
      return {
        success: false,
        message:
          "Unable to send your message right now. Please try again in a moment.",
        fields: raw,
        errors: {},
      };
    }

    const messageId =
      typeof result?.data?.id === "string" ? result.data.id : null;
    if (!messageId) {
      console.error("Resend returned no message id", result);
      return {
        success: false,
        message:
          "Unable to send your message right now. Please try again in a moment.",
        fields: raw,
        errors: {},
      };
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Contact email sent", { id: messageId, to: toEmail });
    }
  } catch (error) {
    console.error("Failed to send contact email", error);
    return {
      success: false,
      message: "Unable to send your message right now. Please try again.",
      fields: raw,
      errors: {},
    };
  }

  return {
    success: true,
    message: "Message sent successfully.",
    fields: { name: "", email: "", message: "" },
    errors: {},
  };
}
