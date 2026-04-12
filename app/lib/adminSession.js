import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


import { sql } from "@/app/lib/db";

function sha256Base64Url(input) {
  return crypto.createHash("sha256").update(input).digest("base64url");
}

/**
 * Returns the current admin session (authenticated + allowlisted), or `null`.
 */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;

  const tokenHash = sha256Base64Url(token);

  const rows = await sql`
    SELECT s.id, s.email, s.expires_at
    FROM admin_sessions s
    JOIN admin_allowlist a ON a.email = s.email
    WHERE s.session_hash = ${tokenHash}
      AND s.expires_at > NOW()
      AND a.is_active = true
    LIMIT 1;
  `;

  if (!rows?.length) return null;

  return {
    id: rows[0].id,
    email: rows[0].email,
    expiresAt: rows[0].expires_at,
  };
}

/**
 * Ensures the request is authenticated as an active allowlisted admin.
 *
 * Default behavior is to redirect to `/admin/login`.
 */
export async function requireAdmin({ redirectTo = "/admin/login" } = {}) {
  const session = await getAdminSession();

  if (!session) {
    if (redirectTo) redirect(redirectTo);
    throw new Error("Not authorized");
  }

  return session;
}
