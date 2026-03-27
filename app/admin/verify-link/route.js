import { NextResponse } from "next/server";
import { verifyAdminMagicLink } from "@/app/actions/adminAuth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const result = await verifyAdminMagicLink({ token, email });

  if (!result.ok) {
    const url = new URL("/admin/verify", request.url);
    url.searchParams.set("error", result.message || "Invalid link");
    return NextResponse.redirect(url);
  }

  const url = new URL("/admin", request.url);
  const response = NextResponse.redirect(url);

  const expires = new Date(result.session.expiresAt);
  response.cookies.set({
    name: "admin_session",
    value: result.session.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });

  return response;
}
