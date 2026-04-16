"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

import { sql } from "@/app/lib/db";

const EMAIL_SCHEMA = z.string().email();

function assertEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function sha256Base64Url(input) {
  return crypto.createHash("sha256").update(input).digest("base64url");
}

function randomToken() {
  return crypto.randomBytes(32).toString("base64url");
}

async function isAllowlisted(email) {
  const rows = await sql`
    SELECT email
    FROM admin_allowlist
    WHERE email = ${email}
      AND is_active = true
    LIMIT 1;
  `;
  return rows?.length === 1;
}

export async function requestAdminMagicLink(_prevState, formData) {
  const rawEmail = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const parsed = EMAIL_SCHEMA.safeParse(rawEmail);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Enter a valid email.",
      fields: { email: rawEmail },
    };
  }

  const email = parsed.data;

  // Do not reveal allowlist status.
  const generic = {
    ok: true,
    message: "If this email is allowed, you’ll receive a sign-in link shortly.",
  };

  const allowlisted = await isAllowlisted(email);
  if (!allowlisted) return generic;

  const appUrl = assertEnv("APP_URL").replace(/\/$/, "");
  const resendKey = assertEnv("RESEND_API_KEY");
  const from = assertEnv("RESEND_FROM");

  const token = randomToken();
  const tokenHash = sha256Base64Url(token);

  const expiresMinutes = Number(
    process.env.ADMIN_MAGIC_LINK_EXPIRES_MINUTES || 15,
  );
  const expiresAt = new Date(Date.now() + expiresMinutes * 60_000);

  await sql`
    INSERT INTO admin_login_tokens (email, token_hash, expires_at)
    VALUES (${email}, ${tokenHash}, ${expiresAt.toISOString()});
  `;

  const verifyUrl = `${appUrl}/admin/verify-link?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  const resend = new Resend(resendKey);
  await resend.emails.send({
    from,
    to: email,
    subject: "Your admin sign-in link",
    text: `Use this link to sign in: ${verifyUrl}\n\nThis link expires in ${expiresMinutes} minutes.`,
  });

  return generic;
}

export async function verifyAdminMagicLink({ token, email }) {
  const safeEmail = EMAIL_SCHEMA.safeParse(
    String(email || "")
      .trim()
      .toLowerCase(),
  );
  if (!safeEmail.success) return { ok: false, message: "Invalid link." };

  const rawToken = String(token || "").trim();
  if (!rawToken) return { ok: false, message: "Invalid link." };

  const tokenHash = sha256Base64Url(rawToken);

  const rows = await sql`
    SELECT id, email, expires_at, used_at
    FROM admin_login_tokens
    WHERE email = ${safeEmail.data}
      AND token_hash = ${tokenHash}
    LIMIT 1;
  `;

  if (!rows?.length)
    return { ok: false, message: "This link is invalid or expired." };

  const record = rows[0];
  if (record.used_at)
    return { ok: false, message: "This link was already used." };
  if (new Date(record.expires_at).getTime() < Date.now()) {
    return { ok: false, message: "This link has expired." };
  }

  const allowlisted = await isAllowlisted(safeEmail.data);
  if (!allowlisted) return { ok: false, message: "Not authorized." };

  await sql`
    UPDATE admin_login_tokens
    SET used_at = NOW()
    WHERE id = ${record.id};
  `;

  const sessionId = crypto.randomUUID();
  const sessionToken = randomToken();
  const sessionTokenHash = sha256Base64Url(sessionToken);
  const sessionDays = Number(process.env.ADMIN_SESSION_DAYS || 14);
  const sessionExpiresAt = new Date(
    Date.now() + sessionDays * 24 * 60 * 60_000,
  );

  await sql`
    INSERT INTO admin_sessions (id, email, session_hash, expires_at)
    VALUES (${sessionId}, ${safeEmail.data}, ${sessionTokenHash}, ${sessionExpiresAt.toISOString()});
  `;

  return {
    ok: true,
    session: {
      token: sessionToken,
      expiresAt: sessionExpiresAt.toISOString(),
    },
  };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  cookieStore.set({
    name: "admin_session",
    value: "",
    path: "/",
    expires: new Date(0),
  });

  if (!token) {
    redirect("/admin/login?logged_out=1");
  }

  const tokenHash = sha256Base64Url(token);
  await sql`
    DELETE FROM admin_sessions
    WHERE session_hash = ${tokenHash};
  `;

  redirect("/admin/login?logged_out=1");
}
