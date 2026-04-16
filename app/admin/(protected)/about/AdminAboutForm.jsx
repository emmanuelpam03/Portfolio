"use client";

import Image from "next/image";
import { useActionState, useEffect, useMemo, useState } from "react";

import { updateAboutAction } from "@/app/actions/aboutActions";
import { useToast } from "@/app/components/ToastProvider";
import { infoList } from "@/assets/assets";

const initialState = {
  ok: false,
  message: null,
  errors: {},
  fields: {},
};

function canPreviewWithNextImage(src) {
  if (!src || typeof src !== "string") return false;

  try {
    const parsed = new URL(src);
    return parsed.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

function truncateMiddle(value, maxLength = 44) {
  if (!value || typeof value !== "string") return "";
  if (value.length <= maxLength) return value;
  const keep = Math.max(10, Math.floor((maxLength - 3) / 2));
  return `${value.slice(0, keep)}...${value.slice(-keep)}`;
}

function moveItem(list, fromIndex, toIndex) {
  if (!Array.isArray(list)) return list;
  if (fromIndex === toIndex) return list;
  if (fromIndex < 0 || fromIndex >= list.length) return list;
  if (toIndex < 0 || toIndex >= list.length) return list;

  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

function normalizeInitialCards(initialAbout) {
  const fallbackKeys = ["languages", "education", "projects"];
  const fallback = Array.isArray(infoList)
    ? infoList.slice(0, 3).map((c, idx) => ({
        title: c?.title ?? `Card ${idx + 1}`,
        description: c?.description ?? "",
        icon_key: fallbackKeys[idx] ?? null,
      }))
    : [
        { title: "Languages", description: "", icon_key: "languages" },
        { title: "Education", description: "", icon_key: "education" },
        { title: "Projects", description: "", icon_key: "projects" },
      ];

  const cards = Array.isArray(initialAbout?.cards)
    ? [...initialAbout.cards]
    : [];
  cards.sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0));

  const normalized = fallback.map((fb, idx) => {
    const card = cards[idx];
    return {
      title: card?.title ?? fb.title,
      description: card?.description ?? fb.description,
      icon_key: card?.icon_key ?? fb.icon_key ?? null,
    };
  });

  return normalized;
}

function normalizeInitialTools(initialAbout) {
  const tools = Array.isArray(initialAbout?.tools)
    ? [...initialAbout.tools]
    : [];
  tools.sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0));

  return tools
    .map((tool) => ({
      media_asset_id: tool?.media_asset_id ?? tool?.id ?? "",
      url: tool?.url ?? "",
      alt: tool?.alt ?? "",
    }))
    .filter(
      (tool) => typeof tool.media_asset_id === "string" && tool.media_asset_id,
    );
}

function normalizeInitialHeroLanguages(initialAbout) {
  const items = Array.isArray(initialAbout?.hero_languages)
    ? [...initialAbout.hero_languages]
    : [];
  items.sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0));

  return items
    .map((item) => ({
      media_asset_id: item?.media_asset_id ?? item?.id ?? "",
      url: item?.url ?? "",
      alt: item?.alt ?? "",
    }))
    .filter(
      (item) => typeof item.media_asset_id === "string" && item.media_asset_id,
    );
}

function normalizeInitialImage(image) {
  if (!image || typeof image !== "object") return null;

  const id = typeof image?.id === "string" ? image.id : "";
  if (!id) return null;

  return {
    id,
    url: typeof image?.url === "string" ? image.url : "",
    alt: typeof image?.alt === "string" ? image.alt : "",
  };
}

function MediaPicker({
  title,
  images,
  selectedId,
  onSelect,
  onClear,
  onClose,
}) {
  return (
    <div className="mt-4 rounded-2xl border border-gray-200 bg-linear-to-r from-blue-50/60 to-purple-50/60 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-gray-900 Ovo">{title}</p>
          <p className="text-sm text-gray-600 Ovo">
            Select an image from your media library.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onClear}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
        {images.length === 0 ? (
          <div className="col-span-full rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600 Ovo">
              No images found. Upload some in Admin → Media.
            </p>
          </div>
        ) : (
          images.map((asset) => {
            const isSelected = asset.id === selectedId;
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => onSelect(asset)}
                className={`rounded-2xl border bg-white p-3 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-blue-400 shadow-lg"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 bg-linear-to-br from-blue-100 to-purple-100">
                  {canPreviewWithNextImage(asset.url) ? (
                    <Image
                      src={asset.url}
                      alt={asset.alt || "Media asset"}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-gray-600 Ovo">
                        Preview unavailable
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900 Ovo truncate">
                    {asset.alt || "(no alt)"}
                  </p>
                  <p className="text-xs text-gray-600 Ovo truncate">
                    {truncateMiddle(asset.url)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function AdminAboutForm({
  initialAbout,
  mediaLibrary,
  setupMessage,
}) {
  const [state, formAction, isPending] = useActionState(
    updateAboutAction,
    initialState,
  );

  const { success: toastSuccess, error: toastError } = useToast();

  useEffect(() => {
    const message =
      typeof state?.message === "string" ? state.message.trim() : "";
    if (!message) return;

    if (state?.ok) {
      toastSuccess(message);
    } else {
      toastError(message);
    }
  }, [state, toastSuccess, toastError]);

  const mediaImages = useMemo(() => {
    const assets = Array.isArray(mediaLibrary) ? mediaLibrary : [];
    return assets
      .filter((asset) => asset && asset.type !== "video")
      .map((asset) => ({
        id: asset.id,
        url: asset.url,
        alt: asset.alt,
      }))
      .filter(
        (asset) =>
          typeof asset.id === "string" && typeof asset.url === "string",
      );
  }, [mediaLibrary]);

  const [cards, setCards] = useState(() => normalizeInitialCards(initialAbout));
  const [tools, setTools] = useState(() => normalizeInitialTools(initialAbout));
  const [heroLanguages, setHeroLanguages] = useState(() =>
    normalizeInitialHeroLanguages(initialAbout),
  );
  const [heroImage, setHeroImage] = useState(() =>
    normalizeInitialImage(initialAbout?.hero_image),
  );
  const [aboutImage, setAboutImage] = useState(() =>
    normalizeInitialImage(initialAbout?.about_image),
  );

  const [openPicker, setOpenPicker] = useState(null); // 'hero' | 'about' | 'heroLanguage' | 'tool'
  const [toolEditIndex, setToolEditIndex] = useState(null);
  const [heroLanguageEditIndex, setHeroLanguageEditIndex] = useState(null);

  const readyForDbWrites = !setupMessage;
  const errors = state?.errors ?? {};

  const toolsJson = JSON.stringify(
    tools.map((tool) => ({ media_asset_id: tool.media_asset_id })),
  );
  const heroLanguagesJson = JSON.stringify(
    heroLanguages.map((item) => ({ media_asset_id: item.media_asset_id })),
  );
  const cardsJson = JSON.stringify(cards);

  function upsertToolAsset(asset, indexToReplace = null) {
    if (!asset?.id) return;

    const nextTool = {
      media_asset_id: asset.id,
      url: asset.url,
      alt: asset.alt,
    };

    setTools((prev) => {
      const current = Array.isArray(prev) ? prev : [];

      if (
        indexToReplace !== null &&
        indexToReplace >= 0 &&
        indexToReplace < current.length
      ) {
        const next = [...current];
        next[indexToReplace] = nextTool;
        return next.filter(
          (tool, i) => i === indexToReplace || tool.media_asset_id !== asset.id,
        );
      }

      const exists = current.some((t) => t.media_asset_id === asset.id);
      if (exists) return current;
      return [...current, nextTool];
    });
  }

  function upsertHeroLanguageAsset(asset, indexToReplace = null) {
    if (!asset?.id) return;

    const nextItem = {
      media_asset_id: asset.id,
      url: asset.url,
      alt: asset.alt,
    };

    setHeroLanguages((prev) => {
      const current = Array.isArray(prev) ? prev : [];

      if (
        indexToReplace !== null &&
        indexToReplace >= 0 &&
        indexToReplace < current.length
      ) {
        const next = [...current];
        next[indexToReplace] = nextItem;
        return next.filter(
          (item, i) => i === indexToReplace || item.media_asset_id !== asset.id,
        );
      }

      const exists = current.some((t) => t.media_asset_id === asset.id);
      if (exists) return current;
      return [...current, nextItem];
    });
  }

  return (
    <form action={formAction} className="mt-6" noValidate>
      {(setupMessage || state?.message) && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-linear-to-r from-blue-50/60 to-purple-50/60 p-4">
          {setupMessage && (
            <p className="text-sm text-gray-700 Ovo">{setupMessage}</p>
          )}
          {state?.message && (
            <p className="text-sm text-gray-700 Ovo">{state.message}</p>
          )}
        </div>
      )}

      <input type="hidden" name="cards_json" value={cardsJson} />
      <input type="hidden" name="tools_json" value={toolsJson} />
      <input
        type="hidden"
        name="hero_languages_json"
        value={heroLanguagesJson}
      />
      <input
        type="hidden"
        name="hero_image_asset_id"
        value={heroImage?.id ?? ""}
      />
      <input
        type="hidden"
        name="about_image_asset_id"
        value={aboutImage?.id ?? ""}
      />

      <div className="flex flex-wrap gap-6">
        <div className="flex-[2_1_520px] min-w-[280px] sm:min-w-[320px] lg:min-w-[420px] space-y-6">
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
              Description
            </h3>
            <p className="text-base text-gray-700 Ovo mb-5">
              This text appears in your public About section.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 Ovo mb-1">
                About text
              </label>
              <textarea
                name="about_text"
                rows={6}
                defaultValue={
                  initialAbout?.about_text ??
                  "I am an experienced Front-End Developer with a strong passion for creating visually appealing and user-friendly websites. I specialize in building responsive web applications that deliver seamless user experiences across various devices. I am proficient in modern frameworks such as React and Next.js."
                }
                aria-invalid={Boolean(errors?.about_text?.length)}
                className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
                  errors?.about_text?.length
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                disabled={!readyForDbWrites || isPending}
              />
              {Array.isArray(errors?.about_text) &&
                errors.about_text.length > 0 && (
                  <p className="mt-2 text-sm text-red-600 Ovo">
                    {errors.about_text[0]}
                  </p>
                )}
              {Array.isArray(errors?.cards) && errors.cards.length > 0 && (
                <p className="mt-2 text-sm text-red-600 Ovo">
                  {errors.cards[0]}
                </p>
              )}
              {Array.isArray(errors?.tools) && errors.tools.length > 0 && (
                <p className="mt-2 text-sm text-red-600 Ovo">
                  {errors.tools[0]}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
                  About cards
                </h3>
                <p className="text-base text-gray-700 Ovo">
                  The three cards shown under About.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              {cards.map((card, index) => {
                const fallbackIcon = infoList?.[index]?.icon;
                const Icon = fallbackIcon ?? null;

                return (
                  <div
                    key={`info-${index}`}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-purple-100 rounded-xl border border-gray-200 flex items-center justify-center">
                          {Icon ? (
                            <Icon
                              className="w-6 h-6 text-gray-700"
                              aria-hidden="true"
                            />
                          ) : (
                            <span className="text-xs text-gray-600 Ovo">
                              Icon
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-600 Ovo">
                            Card {index + 1}
                          </p>
                          <p className="text-base font-medium text-gray-900 Ovo truncate">
                            {card.title || `Card ${index + 1}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 Ovo mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          defaultValue={card.title}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCards((prev) =>
                              prev.map((c, i) =>
                                i === index ? { ...c, title: value } : c,
                              ),
                            );
                          }}
                          className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                          disabled={!readyForDbWrites || isPending}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 Ovo mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          defaultValue={card.description}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCards((prev) =>
                              prev.map((c, i) =>
                                i === index ? { ...c, description: value } : c,
                              ),
                            );
                          }}
                          className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                          disabled={!readyForDbWrites || isPending}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-[1_1_360px] min-w-[280px] sm:min-w-[320px] lg:min-w-[380px] space-y-6">
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
              Pictures
            </h3>
            <p className="text-base text-gray-700 Ovo mb-5">
              Your site uses two different images.
            </p>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-gray-200 bg-linear-to-r from-blue-50/60 to-purple-50/60 p-5">
                <p className="text-base font-semibold text-gray-900 Ovo">
                  Hero image
                </p>
                <p className="text-sm text-gray-600 Ovo mt-1">
                  Used on the Header section.
                </p>
                <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-3 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 bg-linear-to-br from-blue-100 to-purple-100 relative">
                    {heroImage?.url &&
                    canPreviewWithNextImage(heroImage.url) ? (
                      <Image
                        src={heroImage.url}
                        alt={heroImage.alt || "Hero image"}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-gray-600 Ovo">
                          Not set
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600 Ovo">Current</p>
                    <p className="text-base font-medium text-gray-900 Ovo truncate">
                      {heroImage?.id ? heroImage.alt || "Selected" : "Not set"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenPicker((prev) => (prev === "hero" ? null : "hero"))
                    }
                    disabled={!readyForDbWrites || isPending}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-base font-medium disabled:opacity-60"
                  >
                    Replace
                  </button>
                </div>

                {openPicker === "hero" && (
                  <MediaPicker
                    title="Pick hero image"
                    images={mediaImages}
                    selectedId={heroImage?.id ?? null}
                    onSelect={(asset) => {
                      setHeroImage(asset);
                      setOpenPicker(null);
                    }}
                    onClear={() => {
                      setHeroImage(null);
                      setOpenPicker(null);
                    }}
                    onClose={() => setOpenPicker(null)}
                  />
                )}
              </div>

              <div className="rounded-3xl border border-gray-200 bg-linear-to-r from-blue-50/60 to-purple-50/60 p-5">
                <p className="text-base font-semibold text-gray-900 Ovo">
                  About section image
                </p>
                <p className="text-sm text-gray-600 Ovo mt-1">
                  Used inside the About section.
                </p>
                <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-3 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 bg-linear-to-br from-blue-100 to-purple-100 relative">
                    {aboutImage?.url &&
                    canPreviewWithNextImage(aboutImage.url) ? (
                      <Image
                        src={aboutImage.url}
                        alt={aboutImage.alt || "About image"}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-gray-600 Ovo">
                          Not set
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600 Ovo">Current</p>
                    <p className="text-base font-medium text-gray-900 Ovo truncate">
                      {aboutImage?.id
                        ? aboutImage.alt || "Selected"
                        : "Not set"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenPicker((prev) =>
                        prev === "about" ? null : "about",
                      )
                    }
                    disabled={!readyForDbWrites || isPending}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-base font-medium disabled:opacity-60"
                  >
                    Replace
                  </button>
                </div>

                {openPicker === "about" && (
                  <MediaPicker
                    title="Pick about image"
                    images={mediaImages}
                    selectedId={aboutImage?.id ?? null}
                    onSelect={(asset) => {
                      setAboutImage(asset);
                      setOpenPicker(null);
                    }}
                    onClear={() => {
                      setAboutImage(null);
                      setOpenPicker(null);
                    }}
                    onClose={() => setOpenPicker(null)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
                  Header languages
                </h3>
                <p className="text-base text-gray-700 Ovo">
                  Icons shown in the Header section.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHeroLanguageEditIndex(null);
                  setOpenPicker((prev) =>
                    prev === "heroLanguage" ? null : "heroLanguage",
                  );
                }}
                disabled={!readyForDbWrites || isPending}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-base font-medium hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 disabled:opacity-60"
              >
                Add
              </button>
            </div>

            {Array.isArray(errors?.hero_languages) &&
              errors.hero_languages.length > 0 && (
                <p className="mt-4 text-sm text-red-600 Ovo">
                  {errors.hero_languages[0]}
                </p>
              )}

            <div className="mt-6 flex items-center justify-start flex-wrap gap-3">
              {heroLanguages.length === 0 ? (
                <p className="text-sm text-gray-600 Ovo">
                  No languages selected yet.
                </p>
              ) : (
                heroLanguages.map((item, index) => {
                  const label = item.alt || `Language ${index + 1}`;

                  return (
                    <div
                      key={`${item.media_asset_id}-${index}`}
                      className="group relative"
                    >
                      <button
                        type="button"
                        className="relative w-14 h-14 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 overflow-hidden"
                        aria-label={`${label} (edit)`}
                        onClick={() => {
                          setHeroLanguageEditIndex(index);
                          setOpenPicker("heroLanguage");
                        }}
                        disabled={!readyForDbWrites || isPending}
                      >
                        <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {item.url && canPreviewWithNextImage(item.url) ? (
                          <Image
                            src={item.url}
                            alt={label}
                            width={28}
                            height={28}
                            className="relative z-10 w-7 h-7 object-contain"
                          />
                        ) : (
                          <span className="relative z-10 text-xs text-gray-600 Ovo">
                            N/A
                          </span>
                        )}
                      </button>

                      <div className="invisible pointer-events-none opacity-0 group-hover:visible group-focus-within:visible group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-200 absolute left-1/2 top-full -translate-x-1/2 pt-2 flex flex-wrap gap-2 z-50">
                        <button
                          type="button"
                          className="pointer-events-auto px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-60"
                          onClick={() =>
                            setHeroLanguages((prev) =>
                              moveItem(prev, index, index - 1),
                            )
                          }
                          disabled={
                            index === 0 || !readyForDbWrites || isPending
                          }
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="pointer-events-auto px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-60"
                          onClick={() =>
                            setHeroLanguages((prev) =>
                              moveItem(prev, index, index + 1),
                            )
                          }
                          disabled={
                            index === heroLanguages.length - 1 ||
                            !readyForDbWrites ||
                            isPending
                          }
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          className="pointer-events-auto px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-60"
                          onClick={() => {
                            setHeroLanguageEditIndex(index);
                            setOpenPicker("heroLanguage");
                          }}
                          disabled={!readyForDbWrites || isPending}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="pointer-events-auto px-3 py-1.5 rounded-full border border-gray-200 bg-white text-red-600 text-sm font-medium disabled:opacity-60"
                          onClick={() =>
                            setHeroLanguages((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          disabled={!readyForDbWrites || isPending}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {openPicker === "heroLanguage" && (
              <MediaPicker
                title={
                  heroLanguageEditIndex === null
                    ? "Add a language icon"
                    : "Replace language icon"
                }
                images={mediaImages}
                selectedId={
                  heroLanguageEditIndex !== null &&
                  heroLanguages[heroLanguageEditIndex]
                    ? heroLanguages[heroLanguageEditIndex].media_asset_id
                    : null
                }
                onSelect={(asset) => {
                  upsertHeroLanguageAsset(asset, heroLanguageEditIndex);
                  setOpenPicker(null);
                  setHeroLanguageEditIndex(null);
                }}
                onClear={() => {
                  if (heroLanguageEditIndex !== null) {
                    setHeroLanguages((prev) =>
                      prev.filter((_, i) => i !== heroLanguageEditIndex),
                    );
                  }
                  setOpenPicker(null);
                  setHeroLanguageEditIndex(null);
                }}
                onClose={() => {
                  setOpenPicker(null);
                  setHeroLanguageEditIndex(null);
                }}
              />
            )}

            <div className="mt-5 rounded-2xl border border-gray-200 bg-linear-to-r from-blue-50/60 to-purple-50/60 p-4">
              <p className="text-sm text-gray-600 Ovo">
                Tip: hover an icon to reorder.
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
                  Tools I Use
                </h3>
                <p className="text-base text-gray-700 Ovo">
                  Icons shown under About.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setToolEditIndex(null);
                  setHeroLanguageEditIndex(null);
                  setOpenPicker((prev) => (prev === "tool" ? null : "tool"));
                }}
                disabled={!readyForDbWrites || isPending}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-base font-medium hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 disabled:opacity-60"
              >
                Add
              </button>
            </div>

            <div className="mt-6 flex items-center justify-start flex-wrap gap-3">
              {tools.length === 0 ? (
                <p className="text-sm text-gray-600 Ovo">
                  No tools selected yet.
                </p>
              ) : (
                tools.map((tool, index) => {
                  const toolName = tool.alt || `Tool ${index + 1}`;

                  return (
                    <div
                      key={`${tool.media_asset_id}-${index}`}
                      className="group relative"
                    >
                      <button
                        type="button"
                        className="relative w-14 h-14 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 overflow-hidden"
                        aria-label={`${toolName} (edit)`}
                        onClick={() => {
                          setToolEditIndex(index);
                          setOpenPicker("tool");
                        }}
                        disabled={!readyForDbWrites || isPending}
                      >
                        <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {tool.url && canPreviewWithNextImage(tool.url) ? (
                          <Image
                            src={tool.url}
                            alt={toolName}
                            width={28}
                            height={28}
                            className="relative z-10 w-7 h-7 object-contain"
                          />
                        ) : (
                          <span className="relative z-10 text-xs text-gray-600 Ovo">
                            N/A
                          </span>
                        )}
                      </button>

                      <div className="invisible pointer-events-none opacity-0 group-hover:visible group-focus-within:visible group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-200 absolute left-1/2 top-full -translate-x-1/2 pt-2 flex flex-wrap gap-2 z-50">
                        <button
                          type="button"
                          className="pointer-events-auto px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-60"
                          onClick={() =>
                            setTools((prev) => moveItem(prev, index, index - 1))
                          }
                          disabled={
                            index === 0 || !readyForDbWrites || isPending
                          }
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="pointer-events-auto px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-60"
                          onClick={() =>
                            setTools((prev) => moveItem(prev, index, index + 1))
                          }
                          disabled={
                            index === tools.length - 1 ||
                            !readyForDbWrites ||
                            isPending
                          }
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          className="pointer-events-auto px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-60"
                          onClick={() => {
                            setToolEditIndex(index);
                            setOpenPicker("tool");
                          }}
                          disabled={!readyForDbWrites || isPending}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="pointer-events-auto px-3 py-1.5 rounded-full border border-gray-200 bg-white text-red-600 text-sm font-medium disabled:opacity-60"
                          onClick={() =>
                            setTools((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          disabled={!readyForDbWrites || isPending}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {openPicker === "tool" && (
              <MediaPicker
                title={
                  toolEditIndex === null
                    ? "Add a tool icon"
                    : "Replace tool icon"
                }
                images={mediaImages}
                selectedId={
                  toolEditIndex !== null && tools[toolEditIndex]
                    ? tools[toolEditIndex].media_asset_id
                    : null
                }
                onSelect={(asset) => {
                  upsertToolAsset(asset, toolEditIndex);
                  setOpenPicker(null);
                  setToolEditIndex(null);
                  setHeroLanguageEditIndex(null);
                }}
                onClear={() => {
                  if (toolEditIndex !== null) {
                    setTools((prev) =>
                      prev.filter((_, i) => i !== toolEditIndex),
                    );
                  }
                  setOpenPicker(null);
                  setToolEditIndex(null);
                  setHeroLanguageEditIndex(null);
                }}
                onClose={() => {
                  setOpenPicker(null);
                  setToolEditIndex(null);
                  setHeroLanguageEditIndex(null);
                }}
              />
            )}

            <div className="mt-5 rounded-2xl border border-gray-200 bg-linear-to-r from-blue-50/60 to-purple-50/60 p-4">
              <p className="text-sm text-gray-600 Ovo">
                Tip: use Tab to reach the Edit/Remove buttons.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={!readyForDbWrites || isPending}
          className="px-6 py-3 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-base disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
