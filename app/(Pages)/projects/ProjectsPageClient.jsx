"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Puzzle } from "lucide-react";

const slugify = (value) =>
  String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ProjectsPageClient({ projects = [] }) {
  const items = Array.isArray(projects) ? projects : [];

  return (
    <main className="relative w-full min-h-screen pt-28 pb-20 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/30 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-32 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative w-full px-[6%] sm:px-[8%] lg:px-[10%] xl:px-[12%]">
        {/* Page Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5"
          >
            <Puzzle className="w-5 h-5 text-blue-700" aria-hidden="true" />
            <span className="text-base font-medium text-gray-700 Ovo">
              Projects
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-5"
          >
            All Projects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg Ovo leading-relaxed"
          >
            A full collection of my recent work—focused on clean UI, smooth
            interactions, and responsive layouts.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-base"
            >
              <Link
                href="/#contact"
                className="absolute inset-0"
                aria-label="Let's Talk"
              />
              <span>Let&apos;s Talk</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-7 py-3.5 rounded-full border-2 border-gray-300 bg-white text-gray-700 flex items-center gap-2 font-medium hover:border-purple-500 hover:bg-gray-50 transition-all duration-300 shadow-md text-base"
            >
              <Link
                href="/"
                className="absolute inset-0"
                aria-label="Back Home"
              />
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back Home</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
          {items.map((project, index) => {
            const slug = project?.slug
              ? String(project.slug)
              : slugify(project?.title);
            const heroImage = project?.hero_image_url ?? project?.bgImage ?? "";

            return (
              <motion.div
                key={project?.id ?? slug ?? `${project?.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.06 * index }}
                whileHover={{ y: -8 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <Link
                  href={`/projects/${slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View ${project?.title ?? "project"}`}
                />
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Decorative border */}
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-blue-400/50 rounded-2xl transition-all duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-2xl">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                          {project?.title ?? ""}
                        </h2>
                        <p className="text-base text-gray-600 leading-relaxed">
                          {project?.description ?? ""}
                        </p>
                      </div>

                      <div className="flex-shrink-0 w-11 h-11 rounded-full border-2 border-gray-800 flex items-center justify-center shadow-[3px_3px_0_#000] group-hover:shadow-[5px_5px_0_#000] group-hover:bg-gradient-to-br group-hover:from-blue-400 group-hover:to-purple-400 group-hover:border-transparent transition-all duration-300">
                        <ArrowUpRight
                          className="w-5 h-5 text-gray-900 group-hover:text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </main>
  );
}
