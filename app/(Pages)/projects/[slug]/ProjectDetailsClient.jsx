"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import {
  ArrowLeft,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

export default function ProjectDetailsClient({ slug = "", project = null }) {
  const [showAllMedia, setShowAllMedia] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(null);
  const dialogRef = React.useRef(null);
  const closeButtonRef = React.useRef(null);
  const previouslyFocusedElementRef = React.useRef(null);

  const safeSlug = String(slug ?? "");

  const title = project?.title ? String(project.title) : "";
  const description = project?.description ? String(project.description) : "";
  const heroImageUrl = project?.hero_image_url
    ? String(project.hero_image_url)
    : "";
  const projectLiveUrl = project?.project_live_url
    ? String(project.project_live_url)
    : null;
  const projectGithubUrl = project?.project_github_url
    ? String(project.project_github_url)
    : null;

  const mediaItemsRaw = Array.isArray(project?.media) ? project.media : [];
  const mediaItems = mediaItemsRaw
    .map((item) => ({
      id: item?.id ? String(item.id) : null,
      type: item?.type === "video" ? "video" : "image",
      url: item?.url ? String(item.url) : "",
      poster_url: item?.poster_url ? String(item.poster_url) : null,
      alt: item?.alt ? String(item.alt) : "",
      caption: item?.caption ? String(item.caption) : null,
    }))
    .filter((item) => Boolean(item.url));

  const imageItems = mediaItems.filter((item) => item.type === "image");
  const imageIndexByKey = new Map();
  imageItems.forEach((item, index) => {
    const key = item.id ?? item.url;
    if (key) imageIndexByKey.set(key, index);
  });

  const lightboxOpen =
    typeof lightboxIndex === "number" &&
    lightboxIndex >= 0 &&
    lightboxIndex < imageItems.length;

  const activeImage = lightboxOpen ? imageItems[lightboxIndex] : null;

  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = () => {
    setLightboxIndex((current) => {
      if (typeof current !== "number") return current;
      return current > 0 ? current - 1 : current;
    });
  };

  const goNext = () => {
    setLightboxIndex((current) => {
      if (typeof current !== "number") return current;
      const lastIndex = Math.max(0, imageItems.length - 1);
      return current < lastIndex ? current + 1 : current;
    });
  };

  const handleLightboxKeyDown = (event) => {
    if (!lightboxOpen) return;

    if (event.key === "Tab") {
      const container = dialogRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => {
        if (!(node instanceof HTMLElement)) return false;
        if (node.hasAttribute("disabled")) return false;
        return Boolean(
          node.offsetWidth || node.offsetHeight || node.getClientRects().length,
        );
      });

      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || active === container) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last || active === container) {
        event.preventDefault();
        first.focus();
      }

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  React.useEffect(() => {
    if (!lightboxOpen) return;

    previouslyFocusedElementRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    return () => {
      const previous = previouslyFocusedElementRef.current;
      previouslyFocusedElementRef.current = null;
      if (previous && typeof previous.focus === "function") {
        previous.focus();
      }
    };
  }, [lightboxOpen]);

  React.useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen]);

  // URL validation helper at component level or in a utils file
  const isValidHttpUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Helper to validate safe URL schemes
  const isSafeExternalUrl = (url) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  return (
    <main className="relative w-full min-h-screen pt-28 pb-20 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/30 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-32 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="relative w-full px-[6%] sm:px-[8%] lg:px-[10%] xl:px-[12%]">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-6xl mx-auto mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-flex items-center gap-2 text-gray-700 font-medium hover:text-blue-700 transition-colors"
          >
            <Link
              href="/projects"
              className="absolute inset-0"
              aria-label="Back to Projects"
            />
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="Ovo">Back to Projects</span>
          </motion.div>
        </motion.div>

        {/* Not found */}
        {!project && (
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-8 sm:p-10 text-center"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
                <Search className="w-5 h-5 text-blue-700" aria-hidden="true" />
                <span className="text-base font-medium text-gray-700 Ovo">
                  Not Found
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-4">
                Project not found
              </h1>
              <p className="text-gray-600 max-w-xl mx-auto Ovo">
                This project link doesn’t match any published project.
              </p>
              {safeSlug ? (
                <p className="text-gray-500 max-w-xl mx-auto Ovo text-base mt-2">
                  Slug: <span className="font-medium">{safeSlug}</span>
                </p>
              ) : null}
            </motion.div>
          </div>
        )}

        {/* Details */}
        {project && (
          <div className="max-w-6xl mx-auto">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="relative overflow-hidden rounded-3xl border border-gray-200 shadow-2xl"
            >
              {heroImageUrl && isValidHttpUrl(heroImageUrl) && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${heroImageUrl.replace(/["\\]/g, "")}")`,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="relative p-7 sm:p-10 lg:p-12 min-h-[320px] sm:min-h-[420px] flex flex-col justify-end">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="inline-flex w-fit items-center gap-2 px-5 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-5"
                >
                  <Briefcase
                    className="w-5 h-5 text-blue-700"
                    aria-hidden="true"
                  />
                  <span className="text-base font-medium text-gray-700 Ovo">
                    Project Details
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.32 }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-bold Ovo text-white drop-shadow-[0_8px_25px_rgba(0,0,0,0.45)] mb-4"
                >
                  {title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="text-white/85 max-w-2xl Ovo text-base sm:text-lg"
                >
                  {description}
                </motion.p>
              </div>
            </motion.div>

            {/* Content cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-7"
              >
                <h2 className="text-xl sm:text-2xl font-bold Ovo text-gray-900 mb-3">
                  Overview
                </h2>
                <p className="text-gray-600 Ovo leading-relaxed whitespace-pre-line">
                  {description}
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative px-6 py-3 rounded-full border-2 border-gray-300 bg-white text-gray-700 font-medium hover:border-purple-500 hover:bg-gray-50 transition-all duration-300 shadow-md text-base inline-flex items-center justify-center gap-2"
                  >
                    <Link
                      href="/projects"
                      className="absolute inset-0"
                      aria-label="Browse more projects"
                    />
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Browse more</span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.aside
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.22 }}
                className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-7"
              >
                <h3 className="text-lg font-bold Ovo text-gray-900 mb-4">
                  Quick Info
                </h3>
                <div className="space-y-3 text-base text-gray-700">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500 Ovo">Slug</span>
                    <span className="font-medium Ovo">{safeSlug}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500 Ovo">GitHub</span>
                    {isSafeExternalUrl(projectGithubUrl) ? (
                      <Link
                        href={projectGithubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium Ovo text-blue-700 hover:underline"
                      >
                        View
                      </Link>
                    ) : (
                      <span className="font-medium Ovo">—</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500 Ovo">Live</span>
                    {isSafeExternalUrl(projectLiveUrl) ? (
                      <Link
                        href={projectLiveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium Ovo text-blue-700 hover:underline"
                      >
                        Open
                      </Link>
                    ) : (
                      <span className="font-medium Ovo">—</span>
                    )}
                  </div>
                </div>
              </motion.aside>
            </div>

            {/* Media */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-8 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-7"
            >
              {(() => {
                const media = mediaItems;
                const total = media.length;
                const previewLimit = 9;
                const visible = showAllMedia
                  ? media
                  : media.slice(0, previewLimit);
                const canToggle = total > previewLimit;

                return (
                  <>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <h2 className="text-xl sm:text-2xl font-bold Ovo text-gray-900">
                        Media
                      </h2>
                      <span className="text-base text-gray-500 Ovo">
                        {total} items
                      </span>
                    </div>

                    {total === 0 && (
                      <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 p-6 text-center">
                        <p className="text-gray-700 Ovo font-medium">
                          No media uploaded yet
                        </p>
                        <p className="text-gray-500 Ovo text-base mt-1">
                          Images and videos will appear here when added by
                          admin.
                        </p>
                      </div>
                    )}

                    {total > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {visible.map((item, idx) => {
                          const key =
                            item.id ?? `${item.type}-${item.url}-${idx}`;

                          if (item.type === "video") {
                            return (
                              <div
                                key={key}
                                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                              >
                                <video
                                  className="w-full h-full aspect-video object-cover"
                                  controls
                                  preload="metadata"
                                  src={item.url}
                                  poster={item.poster_url || undefined}
                                />
                                {item.caption ? (
                                  <div className="p-3 text-base text-gray-600 Ovo">
                                    {item.caption}
                                  </div>
                                ) : null}
                              </div>
                            );
                          }

                          return (
                            <div
                              key={key}
                              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  const indexKey = item.id ?? item.url;
                                  const nextIndex = indexKey
                                    ? imageIndexByKey.get(indexKey)
                                    : null;
                                  if (typeof nextIndex !== "number") return;
                                  setLightboxIndex(nextIndex);
                                }}
                                className="relative w-full aspect-video cursor-zoom-in"
                                aria-label="Open image"
                              >
                                <Image
                                  src={item.url}
                                  alt={item.alt || `${title} media ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                              </button>
                              {item.caption ? (
                                <div className="p-3 text-base text-gray-600 Ovo">
                                  {item.caption}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {canToggle && (
                      <div className="mt-5 flex justify-center">
                        <button
                          type="button"
                          onClick={() => setShowAllMedia((v) => !v)}
                          className="px-6 py-2.5 rounded-full border-2 border-gray-300 bg-white text-gray-700 font-medium hover:border-purple-500 hover:bg-gray-50 transition-all duration-300 shadow-md text-base"
                        >
                          {showAllMedia
                            ? "Show less"
                            : `View all media (${total})`}
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.section>
          </div>
        )}
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      {activeImage ? (
        <div
          className="fixed inset-0 z-50 bg-black/80 p-4 sm:p-6 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={closeLightbox}
          onKeyDown={handleLightboxKeyDown}
          ref={dialogRef}
          tabIndex={-1}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-12 right-0 sm:right-2 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15 transition"
              aria-label="Close"
              ref={closeButtonRef}
            >
              <X className="w-4 h-4" aria-hidden="true" />
              Close
            </button>

            <div className="relative w-full h-[70vh] sm:h-[78vh] overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <Image
                src={activeImage.url}
                alt={activeImage.alt || `${title} image ${lightboxIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />

              <button
                type="button"
                onClick={goPrev}
                disabled={lightboxIndex === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={lightboxIndex >= imageItems.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
