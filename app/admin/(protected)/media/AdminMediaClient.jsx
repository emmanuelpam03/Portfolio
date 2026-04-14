"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

import {
  deleteMediaAssetAction,
  upsertMediaAssetAction,
} from "@/app/actions/mediaActions";

function toErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  return "Upload failed.";
}

function canPreviewWithNextImage(src) {
  const value = String(src ?? "").trim();
  if (!value) return false;
  if (value.startsWith("/")) return true;
  try {
    const url = new URL(value);
    return url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

async function getCloudinarySignature({ folder } = {}) {
  const body = folder ? JSON.stringify({ folder }) : null;

  const response = await fetch("/api/cloudinary/signature", {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body,
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof json?.error === "string" && json.error.length
        ? json.error
        : "Unable to sign upload.";
    throw new Error(message);
  }

  return json;
}

async function uploadToCloudinary({ file, resourceType, folder }) {
  const {
    cloudName,
    apiKey,
    timestamp,
    folder: signedFolder,
    signature,
  } = await getCloudinarySignature({ folder });

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", String(apiKey));
  body.append("timestamp", String(timestamp));
  body.append("signature", String(signature));
  if (signedFolder) body.append("folder", String(signedFolder));

  const response = await fetch(endpoint, { method: "POST", body });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof json?.error?.message === "string" && json.error.message.length
        ? json.error.message
        : "Upload failed.";
    throw new Error(message);
  }

  const secureUrl = String(json?.secure_url ?? "").trim();
  if (!secureUrl) {
    throw new Error("Upload failed.");
  }

  return { secureUrl };
}

function normalizeAssets(initialAssets) {
  if (!Array.isArray(initialAssets)) return [];

  return initialAssets
    .filter(Boolean)
    .map((asset) => ({
      id: String(asset?.id ?? ""),
      type: asset?.type === "video" ? "video" : "image",
      url: String(asset?.url ?? ""),
      poster_url: asset?.poster_url ? String(asset.poster_url) : null,
      alt: asset?.alt ? String(asset.alt) : null,
      caption: asset?.caption ? String(asset.caption) : null,
    }))
    .filter((asset) => asset.id && asset.url);
}

function inferAssetTypeFromFile(file) {
  const mime = String(file?.type ?? "").toLowerCase();
  return mime.startsWith("video/") ? "video" : "image";
}

function inferAltFromFilename(filename) {
  const name = String(filename ?? "").trim();
  if (!name) return "";

  const withoutExt = name.replace(/\.[^/.]+$/, "");
  const cleaned = withoutExt
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export default function AdminMediaClient({ initialAssets, setupMessage }) {
  const readyForDbWrites = !setupMessage;

  const initial = useMemo(
    () => normalizeAssets(initialAssets),
    [initialAssets],
  );
  const [assets, setAssets] = useState(() => initial);

  const [uploading, setUploading] = useState(false);
  const uploadingRef = useRef(false);
  const [uploadError, setUploadError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [uploadAlt, setUploadAlt] = useState("");

  const [deletingIds, setDeletingIds] = useState(() => ({}));
  const [viewerAsset, setViewerAsset] = useState(null);

  useEffect(() => {
    if (!viewerAsset) return;

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setViewerAsset(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [viewerAsset]);

  async function handleFile(file) {
    if (!file) return;

    setUploadError(null);
    setActionError(null);

    if (uploadingRef.current) {
      setUploadError("An upload is already in progress. Please wait.");
      return;
    }

    if (!readyForDbWrites) {
      setUploadError(setupMessage || "Database not ready.");
      return;
    }

    uploadingRef.current = true;
    setUploading(true);

    const assetType = inferAssetTypeFromFile(file);
    let altText = String(uploadAlt ?? "").trim();
    if (!altText) {
      const inferred = inferAltFromFilename(file?.name);
      if (inferred) {
        altText = inferred;
        setUploadAlt(inferred);
      }
    }

    if (altText.length > 200) {
      altText = altText.slice(0, 200);
      setUploadAlt(altText);
    }

    if (!altText) {
      uploadingRef.current = false;
      setUploading(false);
      setUploadError("Alt text is required.");
      return;
    }

    try {
      const { secureUrl } = await uploadToCloudinary({
        file,
        resourceType: assetType,
        folder: "portfolio/media",
      });

      const result = await upsertMediaAssetAction({
        type: assetType,
        url: secureUrl,
        alt: altText,
      });
      if (!result?.ok || !result?.asset) {
        throw new Error(result?.message || "Unable to save media.");
      }

      setAssets((prev) => {
        const next = [
          {
            id: String(result.asset.id),
            type: result.asset.type === "video" ? "video" : "image",
            url: String(result.asset.url),
            poster_url: result.asset.poster_url
              ? String(result.asset.poster_url)
              : null,
            alt: result.asset.alt ? String(result.asset.alt) : null,
            caption: result.asset.caption ? String(result.asset.caption) : null,
          },
          ...prev,
        ];

        // De-dupe by URL (upsert could return an existing asset)
        const seen = new Set();
        return next.filter((asset) => {
          if (!asset.url) return false;
          if (seen.has(asset.url)) return false;
          seen.add(asset.url);
          return true;
        });
      });

      setUploadAlt("");
    } catch (error) {
      setUploadError(toErrorMessage(error));
    } finally {
      uploadingRef.current = false;
      setUploading(false);
    }
  }

  async function removeAsset(asset) {
    if (!asset?.id) return;

    setActionError(null);
    setDeletingIds((prev) => ({ ...prev, [asset.id]: true }));

    try {
      const result = await deleteMediaAssetAction({ id: asset.id });
      if (!result?.ok) {
        throw new Error(result?.message || "Unable to remove media.");
      }

      setAssets((prev) => prev.filter((x) => x.id !== asset.id));
    } catch (error) {
      setActionError(toErrorMessage(error));
    } finally {
      setDeletingIds((prev) => ({ ...prev, [asset.id]: false }));
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-lg p-6">
        <p className="text-base font-semibold text-gray-900 Ovo">Upload</p>
        <p className="text-sm text-gray-600 Ovo mt-1">
          Upload images and videos (Cloudinary).
        </p>

        {setupMessage ? (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-700 Ovo">{setupMessage}</p>
          </div>
        ) : null}

        <div className="mt-4">
          <label
            htmlFor="admin-media-alt"
            className="block text-sm text-gray-700 Ovo font-medium"
          >
            Alt text <span className="text-red-600">*</span>
          </label>
          <input
            id="admin-media-alt"
            type="text"
            value={uploadAlt}
            maxLength={200}
            disabled={uploading || !readyForDbWrites}
            onChange={(e) => setUploadAlt(e.target.value)}
            placeholder="Describe the media for accessibility"
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 Ovo outline-none focus:ring-2 focus:ring-purple-200 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 Ovo mt-2">
            Required. Used as image alt text and for screen readers.
          </p>
        </div>

        <div
          className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-6 text-center"
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) void handleFile(file);
          }}
        >
          <p className="text-base text-gray-700 Ovo">
            {uploading ? "Uploading…" : "Drop a file here"}
          </p>
          <p className="text-sm text-gray-600 Ovo mt-2">or</p>

          <label
            htmlFor="admin-media-upload"
            aria-disabled={uploading || !readyForDbWrites}
            className={`mt-3 inline-flex px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-base font-medium transition-all duration-300 ${
              uploading || !readyForDbWrites
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
            }`}
          >
            Browse
          </label>
          <input
            id="admin-media-upload"
            type="file"
            accept="image/*,video/*"
            disabled={uploading || !readyForDbWrites}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void handleFile(file);
            }}
          />
        </div>

        {uploadError ? (
          <p className="text-xs text-red-600 Ovo mt-3">{uploadError}</p>
        ) : null}

        {actionError ? (
          <p className="text-xs text-red-600 Ovo mt-2">{actionError}</p>
        ) : null}
      </div>

      <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-lg p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-semibold text-gray-900 Ovo">
            Your files
          </p>
          <p className="text-sm text-gray-600 Ovo">{assets.length} items</p>
        </div>

        {assets.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gradient-to-r from-blue-50/40 to-purple-50/40 p-6 text-center">
            <p className="text-sm text-gray-700 Ovo font-medium">
              No media yet
            </p>
            <p className="text-sm text-gray-600 Ovo mt-1">
              Upload files here, or save a Project to populate the library.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.map((asset) => {
              const isVideo = asset.type === "video";
              const deleting = Boolean(deletingIds[asset.id]);

              return (
                <div
                  key={asset.id}
                  className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setViewerAsset(asset)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setViewerAsset(asset);
                      }
                    }}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-gray-200"
                    aria-label={
                      isVideo ? "Open video preview" : "Open image preview"
                    }
                    title={asset.url}
                  >
                    {!isVideo && canPreviewWithNextImage(asset.url) ? (
                      <Image
                        src={asset.url}
                        alt={asset.alt ? asset.alt : "Media image"}
                        fill
                        sizes="(max-width: 1024px) 50vw, 240px"
                        className="object-cover"
                      />
                    ) : !isVideo ? (
                      <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                        <p className="text-sm text-gray-700 Ovo">Image</p>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <p className="text-sm text-gray-700 Ovo">Video</p>
                        <p className="text-xs text-gray-600 Ovo mt-1">
                          Click to preview
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={deleting}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const confirmed = window.confirm(
                          "Remove this media from the library?",
                        );
                        if (!confirmed) return;
                        void removeAsset(asset);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full border border-gray-200 bg-white/95 text-gray-700 inline-flex items-center justify-center hover:bg-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      aria-label="Remove media"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {viewerAsset ? (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setViewerAsset(null)}
        >
          <button
            type="button"
            onClick={() => setViewerAsset(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full text-white inline-flex items-center justify-center hover:bg-white/10 transition-all duration-300 z-50"
            aria-label="Close preview"
            title="Close (ESC)"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>

          {viewerAsset.type === "video" ? (
            <video
              src={viewerAsset.url}
              controls
              autoPlay
              className="max-w-[95vw] max-h-[95vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={viewerAsset.url}
              alt={viewerAsset.alt ? viewerAsset.alt : "Media preview"}
              className="max-w-[95vw] max-h-[95vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
