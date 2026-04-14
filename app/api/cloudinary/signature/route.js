import crypto from "crypto";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/app/lib/adminSession";

export const runtime = "nodejs";

function sha1Hex(value) {
  return crypto.createHash("sha1").update(value).digest("hex");
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function signCloudinaryParams(params, apiSecret) {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return sha1Hex(`${sorted}${apiSecret}`);
}

export async function POST(request) {
  try {
    await requireAdmin({ redirectTo: null });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let requestedFolder = null;
    try {
      const body = await request.json();
      if (body && typeof body.folder === "string") {
        requestedFolder = body.folder.trim();
      }
    } catch {
      // ignore invalid or missing JSON
    }

    const cloudName = requireEnv("CLOUDINARY_CLOUD_NAME");
    const apiKey = requireEnv("CLOUDINARY_API_KEY");
    const apiSecret = requireEnv("CLOUDINARY_API_SECRET");

    const timestamp = Math.floor(Date.now() / 1000);

    const defaultFolder = "portfolio/projects";
    const allowedFolders = new Set(["portfolio/projects", "portfolio/media"]);
    const folder =
      requestedFolder && allowedFolders.has(requestedFolder)
        ? requestedFolder
        : defaultFolder;

    const paramsToSign = { folder, timestamp };
    const signature = signCloudinaryParams(paramsToSign, apiSecret);

    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
