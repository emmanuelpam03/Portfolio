"use client";

import { assets, infoList, toolsData } from "@/assets/assets";
import Image from "next/image";
import React from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Wrench } from "lucide-react";

const fallbackAboutText =
  "I am an experienced Front-End Developer with a strong passion for creating visually appealing and user-friendly websites. I specialize in building responsive web applications that deliver seamless user experiences across various devices. I am proficient in modern frameworks such as React and Next.js.";

const About = ({ about = null }) => {
  const [toolTooltip, setToolTooltip] = React.useState(null);

  const aboutText =
    about && typeof about?.about_text === "string" && about.about_text.trim()
      ? about.about_text
      : fallbackAboutText;

  const aboutImageSrc =
    about &&
    typeof about?.about_image?.url === "string" &&
    about.about_image.url
      ? about.about_image.url
      : assets.user_image;

  const aboutImageAlt =
    about &&
    typeof about?.about_image?.alt === "string" &&
    about.about_image.alt
      ? about.about_image.alt
      : "user";

  const iconKeyToIcon = {
    languages: infoList?.[0]?.icon,
    education: infoList?.[1]?.icon,
    projects: infoList?.[2]?.icon,
  };

  const sortedDbCards = Array.isArray(about?.cards)
    ? [...about.cards].sort(
        (a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0),
      )
    : [];

  const cardsForUi = (Array.isArray(infoList) ? infoList.slice(0, 3) : []).map(
    (fallback, index) => {
      const dbCard = sortedDbCards[index];
      const iconKey = dbCard?.icon_key ?? null;
      const Icon =
        iconKey && iconKeyToIcon[iconKey]
          ? iconKeyToIcon[iconKey]
          : fallback.icon;

      return {
        Icon,
        title:
          dbCard && typeof dbCard?.title === "string" && dbCard.title.trim()
            ? dbCard.title
            : fallback.title,
        description:
          dbCard &&
          typeof dbCard?.description === "string" &&
          dbCard.description.trim()
            ? dbCard.description
            : fallback.description,
      };
    },
  );

  const sortedDbTools = Array.isArray(about?.tools)
    ? [...about.tools].sort(
        (a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0),
      )
    : [];

  const hasDbAbout = Boolean(about);

  const toolsForUi = sortedDbTools.length
    ? sortedDbTools
        .map((tool, index) => ({
          key: tool?.media_asset_id ?? tool?.id ?? tool?.url ?? `tool-${index}`,
          src: tool?.url ?? "",
          alt:
            tool && typeof tool?.alt === "string" && tool.alt.trim()
              ? tool.alt
              : `Tool ${index + 1}`,
        }))
        .filter((tool) => typeof tool.src === "string" && tool.src)
    : hasDbAbout
      ? []
      : toolsData.map((tool, index) => ({
          key: `fallback-tool-${index}`,
          src: tool,
          alt: "Tool",
        }));

  function showToolTooltip(element, label) {
    if (!element) return;
    if (!label || typeof label !== "string") return;

    const rect = element.getBoundingClientRect();
    setToolTooltip({
      label,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    });
  }

  function hideToolTooltip() {
    setToolTooltip(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      id="about"
      className="relative w-full px-[12%] py-20 scroll-mt-20 bg-gradient-to-b from-white to-blue-50/30 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>

      {/* Section Header */}
      <div className="relative text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-4"
        >
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          <span className="text-base font-medium text-gray-700 Ovo">
            Introduction
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent"
        >
          About Me
        </motion.h2>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative flex w-full flex-col lg:flex-row items-start gap-12 lg:gap-16"
      >
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-auto flex justify-center lg:justify-start lg:flex-shrink-0"
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

            {/* Image container */}
            <div className="relative w-64 sm:w-80 lg:w-96 aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
              <Image
                src={aboutImageSrc}
                alt={aboutImageAlt}
                fill
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                className="object-cover"
              />
            </div>

            {/* Decorative corner accents */}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl"></div>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-4 border-r-4 border-purple-500 rounded-br-3xl"></div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 space-y-8"
        >
          {/* Description */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <p className="text-gray-700 leading-relaxed Ovo text-base sm:text-lg">
              {aboutText}
            </p>
          </div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {cardsForUi.map(({ Icon, title, description }, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                key={index}
                className="group relative bg-white rounded-2xl p-5 border border-gray-200 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    {Icon ? (
                      <Icon
                        className="w-6 h-6 text-gray-700"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-base">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tools Section */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-3"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <h4 className="text-gray-700 font-semibold Ovo flex items-center gap-2">
                <Wrench className="w-5 h-5 text-gray-700" aria-hidden="true" />
                Tools I Use
              </h4>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex items-center justify-center flex-wrap gap-3"
            >
              {toolsForUi.map((tool, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  key={tool.key}
                  className="group relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className="relative w-14 h-14 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 shadow-md hover:shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden"
                    tabIndex={0}
                    aria-label={tool.alt}
                    onMouseEnter={(e) =>
                      showToolTooltip(e.currentTarget, tool.alt)
                    }
                    onMouseLeave={hideToolTooltip}
                    onFocus={(e) => showToolTooltip(e.currentTarget, tool.alt)}
                    onBlur={hideToolTooltip}
                  >
                    {/* Hover background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300" />

                    <Image
                      src={tool.src}
                      alt={tool.alt}
                      width={28}
                      height={28}
                      className="relative z-10 w-7 h-7 object-contain"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {typeof document !== "undefined" &&
              toolTooltip &&
              createPortal(
                <div
                  className="pointer-events-none fixed z-50"
                  style={{
                    left: `${toolTooltip.x}px`,
                    top: `${toolTooltip.y}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="px-3 py-1.5 rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm text-xs text-gray-700 font-semibold shadow-md Ovo max-w-[180px] truncate">
                    {toolTooltip.label}
                  </div>
                </div>,
                document.body,
              )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default About;
