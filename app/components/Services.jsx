"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Brush,
  Globe,
  Layout,
  Puzzle,
  Smartphone,
  Sparkles,
} from "lucide-react";

import { serviceData as fallbackServiceData } from "@/assets/assets";

const FALLBACK_CONTENT = {
  is_enabled: true,
  kicker_text: "What I Offer",
  heading_text: "My Services",
  intro_text:
    "I build fast, scalable front-end experiences using React and Next.js, focused on performance and clean UI.",
  show_cta: true,
  cta_title: "Have a project in mind?",
  cta_body: "Let's work together to bring your ideas to life",
  cta_button_text: "Get in Touch",
  cta_button_href: "#contact",
};

const ICON_KEY_TO_ICON = {
  globe: Globe,
  smartphone: Smartphone,
  layout: Layout,
  brush: Brush,
};

function iconFromKey(iconKey) {
  const key = String(iconKey ?? "")
    .trim()
    .toLowerCase();
  return ICON_KEY_TO_ICON[key] ?? Puzzle;
}

function isExternalHref(href) {
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function pickText(value, fallback) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : fallback;
}

const Services = ({ content = null, services = [] }) => {
  const hasContent = Boolean(content && typeof content === "object");
  const hasServices = Array.isArray(services) && services.length > 0;
  const hasDbData = hasContent || hasServices;

  const isEnabled = hasContent
    ? Boolean(content?.is_enabled)
    : FALLBACK_CONTENT.is_enabled;

  if (!isEnabled) return null;

  const kickerText = hasContent
    ? pickText(content?.kicker_text, FALLBACK_CONTENT.kicker_text)
    : FALLBACK_CONTENT.kicker_text;

  const headingText = hasContent
    ? pickText(content?.heading_text, FALLBACK_CONTENT.heading_text)
    : FALLBACK_CONTENT.heading_text;

  const introText = hasContent
    ? pickText(content?.intro_text, FALLBACK_CONTENT.intro_text)
    : FALLBACK_CONTENT.intro_text;

  const showCta = hasContent
    ? Boolean(content?.show_cta)
    : FALLBACK_CONTENT.show_cta;

  const ctaTitle = hasContent
    ? pickText(content?.cta_title, FALLBACK_CONTENT.cta_title)
    : FALLBACK_CONTENT.cta_title;

  const ctaBody = hasContent
    ? pickText(content?.cta_body, FALLBACK_CONTENT.cta_body)
    : FALLBACK_CONTENT.cta_body;

  const ctaButtonText = hasContent
    ? pickText(content?.cta_button_text, FALLBACK_CONTENT.cta_button_text)
    : FALLBACK_CONTENT.cta_button_text;

  const ctaButtonHref = hasContent
    ? pickText(content?.cta_button_href, FALLBACK_CONTENT.cta_button_href)
    : FALLBACK_CONTENT.cta_button_href;

  const isCtaExternal = isExternalHref(ctaButtonHref);

  const sortedServices = hasServices ? [...services] : [];
  sortedServices.sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0));

  const dbServicesForUi = sortedServices
    .filter((item) => (item?.is_active ?? true) === true)
    .map((item, index) => ({
      key: item?.id ?? `${item?.title ?? "service"}-${index}`,
      Icon: iconFromKey(item?.icon_key),
      title: String(item?.title ?? ""),
      description: String(item?.description ?? ""),
      linkHref: item?.link_url ? String(item.link_url) : null,
    }))
    .filter((item) => item.title.trim() && item.description.trim());

  const fallbackServicesForUi = (Array.isArray(fallbackServiceData)
    ? fallbackServiceData
    : []
  ).map((item, index) => ({
    key: `fallback-service-${index}`,
    Icon: item?.icon ?? Puzzle,
    title: String(item?.title ?? ""),
    description: String(item?.description ?? ""),
    linkHref: item?.link ? String(item.link) : null,
  }));

  const servicesForUi = hasDbData ? dbServicesForUi : fallbackServicesForUi;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      id="services"
      className="relative w-full px-[12%] py-20 scroll-mt-20 bg-gradient-to-b from-blue-50/30 via-purple-50/20 to-white overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />

      {/* Section Header */}
      <div className="relative text-center mb-16">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full border border-purple-200 mb-4"
        >
          <Sparkles className="w-5 h-5 text-purple-700" aria-hidden="true" />
          <span className="text-base font-medium text-gray-700 Ovo">
            {kickerText}
          </span>
        </motion.div>

        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold Ovo bg-gradient-to-r from-gray-900 via-purple-800 to-blue-700 bg-clip-text text-transparent mb-6"
        >
          {headingText}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg Ovo leading-relaxed"
        >
          {introText}
        </motion.p>
      </div>

      {/* Services Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
      >
        {servicesForUi.map(({ Icon, title, description, linkHref, key }, index) => {
          const external = linkHref ? isExternalHref(linkHref) : false;

          return (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -8, scale: 1.02 }}
              key={key}
              className="group relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Decorative corner element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />

              <div className="relative z-10 space-y-4">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md">
                  <Icon className="w-8 h-8 text-gray-700" aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-base text-gray-600 leading-6 min-h-[3rem]">
                  {description}
                </p>

                {linkHref ? (
                  <a
                    href={linkHref}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:text-purple-600 mt-2 group-hover:gap-3 transition-all duration-300"
                  >
                    <span>Learn more</span>
                    <ArrowRight
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      aria-hidden="true"
                    />
                  </a>
                ) : null}
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom CTA Section */}
      {showCta ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="relative text-center mt-20"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xl">
            <div className="flex-1 text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {ctaTitle}
              </h3>
              <p className="text-gray-600 text-base sm:text-lg">{ctaBody}</p>
            </div>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={ctaButtonHref}
              target={isCtaExternal ? "_blank" : undefined}
              rel={isCtaExternal ? "noopener noreferrer" : undefined}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
            >
              <span>{ctaButtonText}</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </motion.a>
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default Services;
