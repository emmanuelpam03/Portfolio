import { sql } from "@/app/lib/db";

export const dynamic = "force-dynamic";

function isMissingSettingsTable(error) {
  const message = String(error instanceof Error ? error.message : error);
  return message.includes('relation "site_settings" does not exist');
}

function textResponse(message, status) {
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function isAllowedExternalCvHost(url) {
  const host = url.hostname.toLowerCase();
  return host === "res.cloudinary.com" || host.endsWith(".cloudinary.com");
}

function filenameFromUrl(url, contentType) {
  const lastSegment = url.pathname.split("/").filter(Boolean).pop();
  let filename = lastSegment ? decodeURIComponent(lastSegment) : "cv";

  if (!filename.includes(".")) {
    if (typeof contentType === "string" && contentType.includes("pdf")) {
      filename = `${filename}.pdf`;
    }
  }

  filename = filename.replace(/[/\\]/g, "_");
  filename = filename.replace(/"/g, "");

  return filename || "cv";
}

export async function GET(request) {
  let cvUrlRaw = "";

  try {
    const rows = await sql`
      SELECT cv_url
      FROM site_settings
      WHERE singleton_key = 'default'
      LIMIT 1
    `;

    cvUrlRaw = String(rows?.[0]?.cv_url ?? "").trim();
  } catch (error) {
    if (isMissingSettingsTable(error)) {
      return textResponse("CV is not configured.", 404);
    }

    console.error("Failed to load CV settings", error);
    return textResponse("Unable to download CV.", 500);
  }

  if (!cvUrlRaw) {
    return textResponse("CV is not configured.", 404);
  }

  if (cvUrlRaw === "/api/cv") {
    return textResponse("CV URL is invalid.", 400);
  }

  let upstreamUrl;
  try {
    upstreamUrl = cvUrlRaw.startsWith("/")
      ? new URL(cvUrlRaw, request.url)
      : new URL(cvUrlRaw);
  } catch {
    return textResponse("CV URL is invalid.", 400);
  }

  if (!cvUrlRaw.startsWith("/")) {
    if (upstreamUrl.protocol !== "https:" && upstreamUrl.protocol !== "http:") {
      return textResponse("CV URL is invalid.", 400);
    }

    if (!isAllowedExternalCvHost(upstreamUrl)) {
      return textResponse("CV host is not allowed.", 400);
    }
  }

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, { redirect: "follow" });
  } catch (error) {
    console.error("Failed to fetch CV", error);
    return textResponse("Unable to download CV.", 502);
  }

  if (!upstream.ok || !upstream.body) {
    return textResponse("Unable to download CV.", 502);
  }

  const contentType =
    upstream.headers.get("content-type") ?? "application/octet-stream";

  const filename = filenameFromUrl(upstreamUrl, contentType);

  const headers = new Headers();
  headers.set("Content-Type", contentType);

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  headers.set(
    "Content-Disposition",
    `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
  );
  headers.set("Cache-Control", "no-store");

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
}
