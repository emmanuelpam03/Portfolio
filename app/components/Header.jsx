"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  Briefcase,
  Download,
  Eye,
  Hand,
  MapPin,
} from "lucide-react";

const FALLBACK_SETTINGS = {
  display_name: "Emmanuel Pam",
  location: "Based in Mauritius",
  hero_headline: "Full-Stack Developer",
  hero_bio:
    "I design, build, and ship full-stack products: responsive UI, secure backends, and scalable data — with React/Next.js.",
  cv_url: "/sample-resume.pdf",
};

const DEFAULT_CV_DOWNLOAD_BASENAME = "Emmanuel_Pam_CV";

function isCloudinaryUrl(urlString) {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();
    return (
      hostname === "res.cloudinary.com" || hostname.endsWith(".cloudinary.com")
    );
  } catch {
    return false;
  }
}

function cvDownloadFilenameFromHref(href) {
  const base = DEFAULT_CV_DOWNLOAD_BASENAME;
  if (!href || typeof href !== "string") return base;

  const pathname = href.split("?")[0].split("#")[0];
  const match = pathname.match(/(\.[a-zA-Z0-9]+)$/);
  const ext = match ? match[1].toLowerCase() : "";

  if (ext === ".pdf" || ext === ".doc" || ext === ".docx") {
    return `${base}${ext}`;
  }

  return base;
}

const Header = ({ heroImage = null, heroLanguages = [], settings = null }) => {
  const [languageTooltip, setLanguageTooltip] = React.useState(null);
  const [cvViewerOpen, setCvViewerOpen] = React.useState(false);
  const [cvViewerIsOpen, setCvViewerIsOpen] = React.useState(false);
  const closeCvViewerTimeoutRef = React.useRef(null);

  const hasSettings = Boolean(settings && typeof settings === "object");

  const displayName =
    settings &&
    typeof settings?.display_name === "string" &&
    settings.display_name.trim()
      ? settings.display_name.trim()
      : FALLBACK_SETTINGS.display_name;

  const locationText =
    settings &&
    typeof settings?.location === "string" &&
    settings.location.trim()
      ? settings.location.trim()
      : FALLBACK_SETTINGS.location;

  const headlineText =
    settings &&
    typeof settings?.hero_headline === "string" &&
    settings.hero_headline.trim()
      ? settings.hero_headline.trim()
      : FALLBACK_SETTINGS.hero_headline;

  const bioText =
    settings &&
    typeof settings?.hero_bio === "string" &&
    settings.hero_bio.trim()
      ? settings.hero_bio.trim()
      : FALLBACK_SETTINGS.hero_bio;

  const cvHref = hasSettings
    ? typeof settings?.cv_url === "string" && settings.cv_url.trim()
      ? settings.cv_url.trim()
      : ""
    : FALLBACK_SETTINGS.cv_url;

  const isCloudinaryCv = Boolean(cvHref && isCloudinaryUrl(cvHref));
  const isLocalCv = Boolean(cvHref && cvHref.startsWith("/"));
  const shouldUseCvApi = Boolean(hasSettings && (isCloudinaryCv || isLocalCv));

  const cvViewSrc = isCloudinaryCv ? "/api/cv?mode=view" : cvHref;
  const cvDownloadHref = shouldUseCvApi ? "/api/cv?mode=download" : cvHref;

  const canUseDownloadAttribute = Boolean(
    cvDownloadHref.startsWith("/") && !cvDownloadHref.startsWith("/api/cv"),
  );

  const cvDownloadFilename = cvDownloadFilenameFromHref(cvDownloadHref);
  const cvDownloadAttrValue = canUseDownloadAttribute
    ? cvDownloadFilename
    : undefined;

  const headlineParts = headlineText.split(/\s+/).filter(Boolean);
  const headlinePrimary = headlineParts[0] ?? "";
  const headlineSecondary = headlineParts.slice(1).join(" ");

  const heroSrc =
    heroImage && typeof heroImage?.url === "string" && heroImage.url
      ? heroImage.url
      : assets.profile_img;

  const heroAlt =
    heroImage && typeof heroImage?.alt === "string" && heroImage.alt
      ? heroImage.alt
      : displayName;

  const sortedHeroLanguages = Array.isArray(heroLanguages)
    ? [...heroLanguages].sort(
        (a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0),
      )
    : [];

  const heroLanguagesForUi = sortedHeroLanguages
    .map((item, index) => ({
      key: item?.media_asset_id ?? item?.id ?? item?.url ?? `lang-${index}`,
      src: item?.url ?? "",
      alt:
        item && typeof item?.alt === "string" && item.alt.trim()
          ? item.alt
          : `Language ${index + 1}`,
    }))
    .filter((item) => typeof item.src === "string" && item.src);

  function showLanguageTooltip(element, label) {
    if (!element) return;
    if (!label || typeof label !== "string") return;

    const rect = element.getBoundingClientRect();
    setLanguageTooltip({
      label,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    });
  }

  function hideLanguageTooltip() {
    setLanguageTooltip(null);
  }

  React.useEffect(() => {
    return () => {
      if (closeCvViewerTimeoutRef.current) {
        clearTimeout(closeCvViewerTimeoutRef.current);
        closeCvViewerTimeoutRef.current = null;
      }
    };
  }, []);

  React.useEffect(() => {
    if (!cvViewerOpen) {
      setCvViewerIsOpen(false);
      return;
    }

    const raf = requestAnimationFrame(() => {
      setCvViewerIsOpen(true);
    });

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [cvViewerOpen]);

  function openCvViewer() {
    if (closeCvViewerTimeoutRef.current) {
      clearTimeout(closeCvViewerTimeoutRef.current);
      closeCvViewerTimeoutRef.current = null;
    }

    setCvViewerIsOpen(false);
    setCvViewerOpen(true);
  }

  function requestCloseCvViewer() {
    setCvViewerIsOpen(false);

    if (closeCvViewerTimeoutRef.current) {
      clearTimeout(closeCvViewerTimeoutRef.current);
    }

    closeCvViewerTimeoutRef.current = setTimeout(() => {
      closeCvViewerTimeoutRef.current = null;
      setCvViewerOpen(false);
    }, 300);
  }

  React.useEffect(() => {
    if (!cvViewerOpen) return;

    function onKeyDown(event) {
      if (event.key === "Escape") {
        requestCloseCvViewer();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [cvViewerOpen]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative w-11/12 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 py-8 px-4">
        {/* Left Side - Text Content */}
        <div className="flex-1 text-center lg:text-left space-y-4">
          {/* Greeting Badge */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-base text-gray-600 font-medium">
              Available for work
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-base md:text-lg Ovo text-gray-600 mb-1 flex items-center gap-2 justify-center lg:justify-start">
              Hi! I&apos;m {displayName}
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <Hand className="w-5 h-5 text-gray-600" aria-hidden="true" />
              </motion.span>
            </h3>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl Ovo font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent">
                {headlinePrimary || headlineText}
              </span>
              {headlineSecondary ? (
                <>
                  <br />
                  <span className="text-gray-800">{headlineSecondary}</span>
                </>
              ) : null}
            </h1>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-2 text-blue-600 font-medium justify-center lg:justify-start"
          >
            <MapPin className="w-5 h-5" aria-hidden="true" />
            <span>{locationText}</span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl"
          >
            {bioText}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start"
          >
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-base"
            >
              <span>Let&apos;s Talk</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </motion.a>

            {cvHref ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    if (cvViewerOpen) {
                      requestCloseCvViewer();
                      return;
                    }

                    openCvViewer();
                  }}
                  className="px-6 py-3 rounded-full border-2 border-gray-300 bg-white text-gray-700 flex items-center gap-2 font-medium hover:border-purple-500 hover:bg-gray-50 transition-all duration-300 shadow-md text-base"
                  aria-expanded={cvViewerOpen}
                >
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  <span>{cvViewerOpen ? "Hide CV" : "View CV"}</span>
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={cvDownloadHref}
                  download={cvDownloadAttrValue}
                  className="px-6 py-3 rounded-full border-2 border-gray-300 bg-white text-gray-700 flex items-center gap-2 font-medium hover:border-purple-500 hover:bg-gray-50 transition-all duration-300 shadow-md text-base"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>Download CV</span>
                </motion.a>
              </>
            ) : null}
          </motion.div>

          {/* Tech Stack Pills */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap gap-2 pt-2 justify-center lg:justify-start"
          >
            {heroLanguagesForUi.length
              ? heroLanguagesForUi.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                    key={item.key}
                    className="group relative"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className="relative w-12 h-12 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 shadow-md hover:shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden"
                      onMouseEnter={(e) =>
                        showLanguageTooltip(e.currentTarget, item.alt)
                      }
                      onMouseLeave={hideLanguageTooltip}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={24}
                        height={24}
                        className="relative z-10 w-6 h-6 object-contain"
                      />
                    </motion.div>
                  </motion.div>
                ))
              : null}
          </motion.div>
        </div>

        {/* Right Side - Profile Image */}
        <motion.div
          initial={{ x: 50, opacity: 0, scale: 0.8 }}
          whileInView={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          className="relative flex-shrink-0"
        >
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>

          {/* Main image container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-[2rem] blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100">
              <Image
                src={heroSrc}
                alt={heroAlt}
                fill
                sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                className="object-cover"
                priority
                loading="eager"
              />
            </div>
          </div>

          {/* Floating badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200 flex items-center gap-2"
          >
            <Briefcase className="w-5 h-5 text-gray-700" aria-hidden="true" />
            <div className="text-left">
              <p className="text-xs text-gray-500">Open to</p>
              <p className="text-sm font-semibold text-gray-800">
                Opportunities
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {typeof document !== "undefined" &&
        languageTooltip &&
        createPortal(
          <div
            className="pointer-events-none fixed z-50"
            style={{
              left: `${languageTooltip.x}px`,
              top: `${languageTooltip.y}px`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="px-3 py-1.5 rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm text-xs text-gray-700 font-semibold shadow-md Ovo max-w-[180px] truncate">
              {languageTooltip.label}
            </div>
          </div>,
          document.body,
        )}

      {typeof document !== "undefined" &&
        cvHref &&
        cvViewSrc &&
        cvViewerOpen &&
        createPortal(
          <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 transition-opacity duration-300 ease-out ${
              cvViewerIsOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={requestCloseCvViewer}
          >
            <div
              className={`transform transition-all duration-300 ease-out ${
                cvViewerIsOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                title="CV"
                src={cvViewSrc}
                className="max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh] bg-white rounded-2xl"
              />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                requestCloseCvViewer();
              }}
              className="absolute top-6 right-6 text-white text-2xl cursor-pointer"
              aria-label="Close preview"
              title="Close (ESC)"
            >
              ✕
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Header;
