import { sql } from "@/app/lib/db";

import path from "node:path";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_CV_BASENAME = "Emmanuel_Pam_CV";

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

function extensionFromContentType(contentType) {
  const value = String(contentType ?? "").toLowerCase();
  if (!value) return "";
  if (value.includes("application/pdf")) return ".pdf";
  if (value.includes("application/msword")) return ".doc";
  if (
    value.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
  ) {
    return ".docx";
  }
  return "";
}

function defaultCvFilename({ contentType, fallbackPathname } = {}) {
  const extFromType = extensionFromContentType(contentType);
  const extFromPath = String(fallbackPathname ?? "")
    ? path.extname(String(fallbackPathname)).toLowerCase()
    : "";
  const ext = extFromType || extFromPath || "";
  return `${DEFAULT_CV_BASENAME}${ext}`;
}

function contentTypeFromPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".doc") return "application/msword";
  if (ext === ".docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  return "application/octet-stream";
}

function safePublicFilePath(urlPathname) {
  const withoutQuery = String(urlPathname ?? "")
    .split("?")[0]
    .split("#")[0];
  const relative = withoutQuery.replace(/^\/+/, "");
  if (!relative) return null;

  const normalized = path.normalize(relative);
  if (normalized.startsWith("..") || path.isAbsolute(normalized)) return null;

  const publicDir = path.join(process.cwd(), "public");
  const filePath = path.join(publicDir, normalized);

  const publicDirWithSep = publicDir.endsWith(path.sep)
    ? publicDir
    : `${publicDir}${path.sep}`;

  if (!filePath.startsWith(publicDirWithSep)) return null;
  return filePath;
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const mode = String(requestUrl.searchParams.get("mode") ?? "download");
  const disposition = mode === "view" ? "inline" : "attachment";

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

  if (cvUrlRaw.startsWith("/")) {
    const filePath = safePublicFilePath(cvUrlRaw);
    if (!filePath) {
      return textResponse("CV URL is invalid.", 400);
    }

    let fileStats;
    try {
      fileStats = await stat(filePath);
    } catch {
      return textResponse("CV is not configured.", 404);
    }

    if (!fileStats.isFile()) {
      return textResponse("CV is not configured.", 404);
    }

    const contentType = contentTypeFromPath(filePath);
    const filename = defaultCvFilename({
      contentType,
      fallbackPathname: filePath,
    });

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Length", String(fileStats.size));
    headers.set(
      "Content-Disposition",
      `${disposition}; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    );
    headers.set("Cache-Control", "no-store");

    const stream = createReadStream(filePath);
    return new Response(Readable.toWeb(stream), {
      status: 200,
      headers,
    });
  }

  let upstreamUrl;
  try {
    upstreamUrl = new URL(cvUrlRaw);
  } catch {
    return textResponse("CV URL is invalid.", 400);
  }

  if (upstreamUrl.protocol !== "https:" && upstreamUrl.protocol !== "http:") {
    return textResponse("CV URL is invalid.", 400);
  }

  if (!isAllowedExternalCvHost(upstreamUrl)) {
    return textResponse("CV host is not allowed.", 400);
  }

  const range = request.headers.get("range");
  let upstreamResponse;

  try {
    upstreamResponse = await fetch(upstreamUrl.toString(), {
      headers: range ? { Range: range } : undefined,
    });
  } catch (error) {
    console.error("Failed to fetch external CV", error);
    return textResponse("Unable to download CV.", 502);
  }

  if (!upstreamResponse.ok && upstreamResponse.status !== 206) {
    if (upstreamResponse.status === 404) {
      return textResponse("CV is not configured.", 404);
    }

    console.error(
      "External CV request failed",
      upstreamResponse.status,
      upstreamUrl.toString(),
    );
    return textResponse("Unable to download CV.", 502);
  }

  const headers = new Headers();
  const upstreamType = upstreamResponse.headers.get("content-type");
  const guessedType = contentTypeFromPath(upstreamUrl.pathname);
  const contentType =
    upstreamType && !upstreamType.startsWith("application/octet-stream")
      ? upstreamType
      : guessedType;

  const filename = defaultCvFilename({
    contentType,
    fallbackPathname: upstreamUrl.pathname,
  });

  headers.set("Content-Type", contentType);

  const contentLength = upstreamResponse.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  const acceptRanges = upstreamResponse.headers.get("accept-ranges");
  if (acceptRanges) headers.set("Accept-Ranges", acceptRanges);

  const contentRange = upstreamResponse.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);

  headers.set(
    "Content-Disposition",
    `${disposition}; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
  );
  headers.set("Cache-Control", "no-store");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  });
}
