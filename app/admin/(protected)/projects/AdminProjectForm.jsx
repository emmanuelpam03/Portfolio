"use client";

import Image from "next/image";
import { useActionState, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Image as ImageIcon,
  Plus,
  Trash2,
  Video,
} from "lucide-react";

const initialState = { ok: false, message: null, errors: {}, fields: {} };

function makeClientId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function truncateUrl(url, maxLength = 72) {
  const value = String(url ?? "");
  if (value.length <= maxLength) return value;
  const head = value.slice(0, Math.ceil(maxLength * 0.65));
  const tail = value.slice(-Math.floor(maxLength * 0.25));
  return `${head}…${tail}`;
}

function toErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  return "Upload failed.";
}

async function getCloudinarySignature() {
  const response = await fetch("/api/cloudinary/signature", { method: "POST" });
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

async function uploadToCloudinary({ file, resourceType }) {
  const { cloudName, apiKey, timestamp, folder, signature } =
    await getCloudinarySignature();

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", String(apiKey));
  body.append("timestamp", String(timestamp));
  body.append("signature", String(signature));
  body.append("folder", String(folder));

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

function normalizeInitialMedia(initialMedia) {
  if (!Array.isArray(initialMedia)) return [];
  return initialMedia
    .slice()
    .sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
    .map((item) => ({
      clientId: item?.id ? String(item.id) : makeClientId(),
      type: item?.type === "video" ? "video" : "image",
      url: String(item?.url ?? ""),
      poster_url: String(item?.poster_url ?? ""),
      alt: String(item?.alt ?? ""),
      caption: String(item?.caption ?? ""),
    }));
}

function moveItem(list, fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= list.length) return list;
  const next = list.slice();
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export default function AdminProjectForm({
  action,
  submitLabel = "Save",
  initialProject,
  initialMedia,
}) {
  const initialFields = useMemo(
    () => ({
      id: initialProject?.id ? String(initialProject.id) : "",
      slug: initialProject?.slug ? String(initialProject.slug) : "",
      title: initialProject?.title ? String(initialProject.title) : "",
      description: initialProject?.description
        ? String(initialProject.description)
        : "",
      hero_image_url: initialProject?.hero_image_url
        ? String(initialProject.hero_image_url)
        : "",
      project_github_url: initialProject?.project_github_url
        ? String(initialProject.project_github_url)
        : "",
      project_live_url: initialProject?.project_live_url
        ? String(initialProject.project_live_url)
        : "",
      is_published: Boolean(initialProject?.is_published),
      is_featured: Boolean(initialProject?.is_featured),
    }),
    [initialProject],
  );

  const [heroImageUrl, setHeroImageUrl] = useState(
    () => initialFields.hero_image_url,
  );
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadError, setHeroUploadError] = useState(null);

  const [media, setMedia] = useState(() => normalizeInitialMedia(initialMedia));
  const [mediaUploading, setMediaUploading] = useState(() => ({}));
  const [mediaUploadErrors, setMediaUploadErrors] = useState(() => ({}));
  const [state, formAction, isPending] = useActionState(action, initialState);

  const errors = state?.errors ?? {};

  const isUploading =
    heroUploading || Object.values(mediaUploading).some((value) => value);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-5" noValidate>
      {state?.message ? (
        <div
          className={`rounded-2xl border border-gray-200 p-4 ${
            state.ok
              ? "bg-gradient-to-r from-blue-50/60 to-purple-50/60"
              : "bg-white"
          }`}
        >
          <p className="text-sm text-gray-700 Ovo">{state.message}</p>
        </div>
      ) : null}

      {errors?.media?.length ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-red-600 Ovo">{errors.media[0]}</p>
        </div>
      ) : null}

      <input type="hidden" name="id" value={initialFields.id} />
      <input type="hidden" name="slug" value={initialFields.slug} />
      <input type="hidden" name="hero_image_url" value={heroImageUrl} />
      <input type="hidden" name="media_json" value={JSON.stringify(media)} />

      <div>
        <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={initialFields.title}
          placeholder="Project name"
          className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
          aria-invalid={Boolean(errors?.title?.length)}
        />
        {errors?.title?.length ? (
          <p className="text-xs text-red-600 Ovo mt-2">{errors.title[0]}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
          Description
        </label>
        <textarea
          name="description"
          rows={5}
          defaultValue={initialFields.description}
          placeholder="What is this project about?"
          className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
          aria-invalid={Boolean(errors?.description?.length)}
        />
        {errors?.description?.length ? (
          <p className="text-xs text-red-600 Ovo mt-2">
            {errors.description[0]}
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-gray-900 Ovo">
              Hero image
            </p>
            <p className="text-sm text-gray-600 Ovo mt-1">
              Upload a cover image for this project.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!heroImageUrl || isPending || heroUploading}
              onClick={() => {
                if (!heroImageUrl) return;
                window.open(heroImageUrl, "_blank", "noopener,noreferrer");
              }}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Open
            </button>

            <button
              type="button"
              disabled={!heroImageUrl || isPending || heroUploading}
              onClick={() => {
                setHeroUploadError(null);
                setHeroImageUrl("");
              }}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white text-red-600 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Clear
            </button>

            <label
              htmlFor="hero-image-upload"
              aria-disabled={isPending || heroUploading}
              className={`px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium transition-all duration-300 ${
                isPending || heroUploading
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
              }`}
            >
              {heroUploading
                ? "Uploading…"
                : heroImageUrl
                  ? "Replace"
                  : "Browse"}
            </label>
            <input
              id="hero-image-upload"
              type="file"
              accept="image/*"
              disabled={isPending || heroUploading}
              className="sr-only"
              aria-invalid={Boolean(errors?.hero_image_url?.length)}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setHeroUploadError(null);
                setHeroUploading(true);

                try {
                  const result = await uploadToCloudinary({
                    file,
                    resourceType: "image",
                  });
                  setHeroImageUrl(result.secureUrl);
                } catch (error) {
                  setHeroUploadError(toErrorMessage(error));
                } finally {
                  setHeroUploading(false);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gradient-to-r from-blue-50/60 to-purple-50/60 relative h-44 sm:h-52">
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt="Hero image preview"
              fill
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-contain bg-white"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <p className="text-base text-gray-700 Ovo">No hero image yet</p>
              <p className="text-sm text-gray-600 Ovo mt-2">
                Use the Browse button to upload.
              </p>
            </div>
          )}

          {heroUploading ? (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
              <p className="text-sm text-gray-700 Ovo">Uploading…</p>
            </div>
          ) : null}
        </div>

        <div className="mt-3">
          {heroUploadError ? (
            <p className="text-xs text-red-600 Ovo">{heroUploadError}</p>
          ) : null}
          {errors?.hero_image_url?.length ? (
            <p className="text-xs text-red-600 Ovo mt-2">
              {errors.hero_image_url[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
          GitHub URL
        </label>
        <input
          type="url"
          name="project_github_url"
          defaultValue={initialFields.project_github_url}
          placeholder="https://github.com/..."
          className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
          inputMode="url"
          aria-invalid={Boolean(errors?.project_github_url?.length)}
        />
        {errors?.project_github_url?.length ? (
          <p className="text-xs text-red-600 Ovo mt-2">
            {errors.project_github_url[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
          Live URL (optional)
        </label>
        <input
          type="url"
          name="project_live_url"
          defaultValue={initialFields.project_live_url}
          placeholder="https://..."
          className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
          inputMode="url"
          aria-invalid={Boolean(errors?.project_live_url?.length)}
        />
        {errors?.project_live_url?.length ? (
          <p className="text-xs text-red-600 Ovo mt-2">
            {errors.project_live_url[0]}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700 Ovo">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={initialFields.is_published}
            className="w-4 h-4"
          />
          Published
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-gray-700 Ovo">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={initialFields.is_featured}
            className="w-4 h-4"
          />
          Featured
        </label>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-gray-900 Ovo">Media</p>
            <p className="text-sm text-gray-600 Ovo mt-1">
              Add unlimited images and videos (uploads to Cloudinary).
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setMedia((items) => [
                  ...items,
                  {
                    clientId: makeClientId(),
                    type: "image",
                    url: "",
                    poster_url: "",
                    alt: "",
                    caption: "",
                  },
                ])
              }
              disabled={isPending || isUploading}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <ImageIcon className="w-4 h-4" aria-hidden="true" />
              Add image
            </button>
            <button
              type="button"
              onClick={() =>
                setMedia((items) => [
                  ...items,
                  {
                    clientId: makeClientId(),
                    type: "video",
                    url: "",
                    poster_url: "",
                    alt: "",
                    caption: "",
                  },
                ])
              }
              disabled={isPending || isUploading}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <Video className="w-4 h-4" aria-hidden="true" />
              Add video
            </button>
          </div>
        </div>

        {media.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gradient-to-r from-blue-50/40 to-purple-50/40 p-6 text-center">
            <p className="text-sm text-gray-700 Ovo font-medium">No media</p>
            <p className="text-sm text-gray-600 Ovo mt-1">
              Add screenshots and demo videos.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4">
            {media.map((item, index) => {
              const isVideo = item.type === "video";
              const clientId = String(item?.clientId ?? `${item.type}-${index}`);
              const mediaKey = `media-${clientId}`;
              const posterKey = `poster-${clientId}`;
              const fileInputId = `media-${clientId}-file`;
              const posterInputId = `media-${clientId}-poster`;
              const mediaIsUploading = Boolean(mediaUploading[mediaKey]);
              const posterIsUploading = Boolean(mediaUploading[posterKey]);
              const mediaUploadError = mediaUploadErrors[mediaKey] ?? null;
              const posterUploadError = mediaUploadErrors[posterKey] ?? null;
              return (
                <div
                  key={clientId}
                  className="rounded-2xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-10 h-10 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-100 to-purple-100 inline-flex items-center justify-center">
                        {isVideo ? (
                          <Video className="w-5 h-5 text-blue-800" aria-hidden="true" />
                        ) : (
                          <ImageIcon
                            className="w-5 h-5 text-blue-800"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <p className="text-sm font-semibold text-gray-900 Ovo">
                        {isVideo ? "Video" : "Image"} #{index + 1}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setMedia((items) => moveItem(items, index, index - 1))}
                        disabled={index === 0 || isPending || isUploading}
                        className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-50 inline-flex items-center gap-2"
                        aria-label="Move up"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" aria-hidden="true" />
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => setMedia((items) => moveItem(items, index, index + 1))}
                        disabled={index === media.length - 1 || isPending || isUploading}
                        className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-50 inline-flex items-center gap-2"
                        aria-label="Move down"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" aria-hidden="true" />
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setMedia((items) => items.filter((_, i) => i !== index))
                        }
                        disabled={isPending || isUploading}
                        className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-red-600 text-sm font-medium inline-flex items-center gap-2"
                        aria-label="Remove"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 Ovo">
                            {isVideo ? "Video file" : "Image file"}
                          </p>
                          <p className="text-sm text-gray-600 Ovo mt-1">
                            {mediaIsUploading
                              ? "Uploading…"
                              : item.url
                                ? "Uploaded"
                                : "No file uploaded yet"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={
                              !item.url ||
                              isPending ||
                              isUploading ||
                              mediaIsUploading
                            }
                            onClick={() => {
                              if (!item.url) return;
                              window.open(item.url, "_blank", "noopener,noreferrer");
                            }}
                            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            Open
                          </button>

                          <button
                            type="button"
                            disabled={
                              !item.url ||
                              isPending ||
                              isUploading ||
                              mediaIsUploading
                            }
                            onClick={() => {
                              setMediaUploadErrors((prev) => ({
                                ...prev,
                                [mediaKey]: null,
                              }));
                              setMedia((items) =>
                                items.map((x) =>
                                  x.clientId === clientId ? { ...x, url: "" } : x,
                                ),
                              );
                            }}
                            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-red-600 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            Clear
                          </button>

                          <label
                            htmlFor={fileInputId}
                            aria-disabled={isPending || isUploading || mediaIsUploading}
                            className={`px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium transition-all duration-300 ${
                              isPending || isUploading || mediaIsUploading
                                ? "opacity-60 cursor-not-allowed"
                                : "cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                            }`}
                          >
                            {mediaIsUploading
                              ? "Uploading…"
                              : item.url
                                ? "Replace"
                                : "Browse"}
                          </label>
                          <input
                            id={fileInputId}
                            type="file"
                            accept={isVideo ? "video/*" : "image/*"}
                            disabled={isPending || isUploading || mediaIsUploading}
                            className="sr-only"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              setMediaUploadErrors((prev) => ({
                                ...prev,
                                [mediaKey]: null,
                              }));
                              setMediaUploading((prev) => ({
                                ...prev,
                                [mediaKey]: true,
                              }));

                              try {
                                const result = await uploadToCloudinary({
                                  file,
                                  resourceType: isVideo ? "video" : "image",
                                });
                                setMedia((items) =>
                                  items.map((x) =>
                                    x.clientId === clientId
                                      ? { ...x, url: result.secureUrl }
                                      : x,
                                  ),
                                );
                              } catch (error) {
                                setMediaUploadErrors((prev) => ({
                                  ...prev,
                                  [mediaKey]: toErrorMessage(error),
                                }));
                              } finally {
                                setMediaUploading((prev) => ({
                                  ...prev,
                                  [mediaKey]: false,
                                }));
                                e.target.value = "";
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gradient-to-r from-blue-50/60 to-purple-50/60 aspect-video relative">
                        {!isVideo && item.url ? (
                          <Image
                            src={item.url}
                            alt={item.alt ? item.alt : "Uploaded image"}
                            fill
                            sizes="(max-width: 1024px) 100vw, 960px"
                            className="object-contain bg-white"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                            <p className="text-base text-gray-700 Ovo">
                              {isVideo
                                ? item.url
                                  ? "Video uploaded"
                                  : "No video uploaded yet"
                                : "No image uploaded yet"}
                            </p>
                            <p className="text-sm text-gray-600 Ovo mt-2">
                              Use the Browse button to upload.
                            </p>
                          </div>
                        )}

                        {mediaIsUploading ? (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                            <p className="text-sm text-gray-700 Ovo">
                              Uploading…
                            </p>
                          </div>
                        ) : null}
                      </div>

                      {mediaUploadError ? (
                        <p className="text-xs text-red-600 Ovo mt-3">
                          {mediaUploadError}
                        </p>
                      ) : null}
                    </div>

                    {isVideo ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                          Poster image file (optional)
                        </label>
                        <div className="rounded-2xl border border-gray-200 bg-white p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="text-sm text-gray-600 Ovo">
                                {posterIsUploading
                                  ? "Uploading…"
                                  : item.poster_url
                                    ? "Uploaded"
                                    : "No poster uploaded"}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                disabled={
                                  !item.poster_url ||
                                  isPending ||
                                  isUploading ||
                                  posterIsUploading
                                }
                                onClick={() => {
                                  if (!item.poster_url) return;
                                  window.open(
                                    item.poster_url,
                                    "_blank",
                                    "noopener,noreferrer",
                                  );
                                }}
                                className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                Open
                              </button>

                              <button
                                type="button"
                                disabled={
                                  !item.poster_url ||
                                  isPending ||
                                  isUploading ||
                                  posterIsUploading
                                }
                                onClick={() => {
                                  setMediaUploadErrors((prev) => ({
                                    ...prev,
                                    [posterKey]: null,
                                  }));
                                  setMedia((items) =>
                                    items.map((x) =>
                                      x.clientId === clientId
                                        ? { ...x, poster_url: "" }
                                        : x,
                                    ),
                                  );
                                }}
                                className="px-4 py-2 rounded-full border border-gray-200 bg-white text-red-600 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                Clear
                              </button>

                              <label
                                htmlFor={posterInputId}
                                aria-disabled={isPending || isUploading || posterIsUploading}
                                className={`px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium transition-all duration-300 ${
                                  isPending || isUploading || posterIsUploading
                                    ? "opacity-60 cursor-not-allowed"
                                    : "cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                                }`}
                              >
                                {posterIsUploading
                                  ? "Uploading…"
                                  : item.poster_url
                                    ? "Replace"
                                    : "Browse"}
                              </label>
                              <input
                                id={posterInputId}
                                type="file"
                                accept="image/*"
                                disabled={isPending || isUploading || posterIsUploading}
                                className="sr-only"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  setMediaUploadErrors((prev) => ({
                                    ...prev,
                                    [posterKey]: null,
                                  }));
                                  setMediaUploading((prev) => ({
                                    ...prev,
                                    [posterKey]: true,
                                  }));

                                  try {
                                    const result = await uploadToCloudinary({
                                      file,
                                      resourceType: "image",
                                    });
                                    setMedia((items) =>
                                      items.map((x) =>
                                        x.clientId === clientId
                                          ? {
                                              ...x,
                                              poster_url: result.secureUrl,
                                            }
                                          : x,
                                      ),
                                    );
                                  } catch (error) {
                                    setMediaUploadErrors((prev) => ({
                                      ...prev,
                                      [posterKey]: toErrorMessage(error),
                                    }));
                                  } finally {
                                    setMediaUploading((prev) => ({
                                      ...prev,
                                      [posterKey]: false,
                                    }));
                                    e.target.value = "";
                                  }
                                }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gradient-to-r from-blue-50/60 to-purple-50/60 aspect-video relative">
                            {item.poster_url ? (
                              <Image
                                src={item.poster_url}
                                alt="Poster image preview"
                                fill
                                sizes="(max-width: 1024px) 100vw, 960px"
                                className="object-contain bg-white"
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                <p className="text-base text-gray-700 Ovo">
                                  No poster uploaded
                                </p>
                                <p className="text-sm text-gray-600 Ovo mt-2">
                                  Optional, but recommended for videos.
                                </p>
                              </div>
                            )}

                            {posterIsUploading ? (
                              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                                <p className="text-sm text-gray-700 Ovo">
                                  Uploading…
                                </p>
                              </div>
                            ) : null}
                          </div>

                          {posterUploadError ? (
                            <p className="text-xs text-red-600 Ovo mt-3">
                              {posterUploadError}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                          Alt text (optional)
                        </label>
                        <input
                          type="text"
                          value={item.alt}
                          onChange={(e) => {
                            const nextAlt = e.target.value;
                            setMedia((items) =>
                              items.map((x, i) => (i === index ? { ...x, alt: nextAlt } : x)),
                            );
                          }}
                          placeholder="Describe the image"
                          className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                        Caption (optional)
                      </label>
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => {
                          const nextCaption = e.target.value;
                          setMedia((items) =>
                            items.map((x, i) =>
                              i === index ? { ...x, caption: nextCaption } : x,
                            ),
                          );
                        }}
                        placeholder="Short caption"
                        className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || isUploading}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving…" : isUploading ? "Uploading…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
