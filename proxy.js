import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

function base64UrlFromBytes(bytes) {
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sha256Base64Url(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlFromBytes(new Uint8Array(digest));
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/admin/verify" ||
    pathname.startsWith("/admin/verify-link");

  const sessionToken = request.cookies.get("admin_session")?.value;
  if (!sessionToken) {
    if (isAuthPage) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    if (isAuthPage) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  const sql = neon(databaseUrl);
  const sessionHash = await sha256Base64Url(sessionToken);

  const rows = await sql`
    SELECT s.id
    FROM admin_sessions s
    JOIN admin_allowlist a ON a.email = s.email
    WHERE s.session_hash = ${sessionHash}
      AND s.expires_at > NOW()
      AND a.is_active = true
    LIMIT 1;
  `;

  if (!rows?.length) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    const response = NextResponse.redirect(url);
    response.cookies.set({
      name: "admin_session",
      value: "",
      path: "/",
      expires: new Date(0),
    });
    return response;
  }

  // Logged in: keep auth pages inaccessible.
  if (isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
