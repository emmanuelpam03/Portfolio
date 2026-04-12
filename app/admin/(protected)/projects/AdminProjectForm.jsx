"use client";

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

function normalizeInitialMedia(initialMedia) {
  if (!Array.isArray(initialMedia)) return [];
  return initialMedia
    .slice()
    .sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
    .map((item) => ({
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

  const [media, setMedia] = useState(() => normalizeInitialMedia(initialMedia));
  const [state, formAction, isPending] = useActionState(action, initialState);

  const errors = state?.errors ?? {};

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

      <div>
        <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
          Hero image URL
        </label>
        <input
          type="url"
          name="hero_image_url"
          defaultValue={initialFields.hero_image_url}
          placeholder="https://..."
          className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
          inputMode="url"
          aria-invalid={Boolean(errors?.hero_image_url?.length)}
        />
        {errors?.hero_image_url?.length ? (
          <p className="text-xs text-red-600 Ovo mt-2">
            {errors.hero_image_url[0]}
          </p>
        ) : null}
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
              Add unlimited images and videos (URLs only).
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setMedia((items) => [
                  ...items,
                  { type: "image", url: "", poster_url: "", alt: "", caption: "" },
                ])
              }
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 inline-flex items-center gap-2"
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
                  { type: "video", url: "", poster_url: "", alt: "", caption: "" },
                ])
              }
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 inline-flex items-center gap-2"
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
              return (
                <div
                  key={`${item.type}-${index}`}
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
                        disabled={index === 0}
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
                        disabled={index === media.length - 1}
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                        URL
                      </label>
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) => {
                          const nextUrl = e.target.value;
                          setMedia((items) =>
                            items.map((x, i) => (i === index ? { ...x, url: nextUrl } : x)),
                          );
                        }}
                        placeholder="https://..."
                        className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                        inputMode="url"
                      />
                    </div>

                    {isVideo ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                          Poster URL (optional)
                        </label>
                        <input
                          type="url"
                          value={item.poster_url}
                          onChange={(e) => {
                            const nextPoster = e.target.value;
                            setMedia((items) =>
                              items.map((x, i) =>
                                i === index ? { ...x, poster_url: nextPoster } : x,
                              ),
                            );
                          }}
                          placeholder="https://..."
                          className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                          inputMode="url"
                        />
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
          disabled={isPending}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
