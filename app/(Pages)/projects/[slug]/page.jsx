"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { assets, workData } from "@/assets/assets";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const ProjectDetailsPage = () => {
  const { slug } = useParams();

  const projectIndex = workData.findIndex(
    (p) => slugify(p.title) === String(slug),
  );
  const project = projectIndex >= 0 ? workData[projectIndex] : null;

  return (
    <>
      <Navbar />

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
              className="inline-flex items-center gap-2 text-gray-700 font-medium hover:text-blue-700 transition-colors"
            >
              <Link
                href="/projects"
                className="absolute inset-0"
                aria-label="Back to Projects"
              />
              <Image
                src={assets.right_arrow_bold}
                alt=""
                className="w-4 h-4 rotate-180"
              />
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
                  <span className="text-xl">🔎</span>
                  <span className="text-sm font-medium text-gray-700 Ovo">
                    Not Found
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-4">
                  Project not found
                </h1>
                <p className="text-gray-600 max-w-xl mx-auto Ovo">
                  This project link doesn’t match any item in your current
                  project list.
                </p>
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
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                <div className="relative p-7 sm:p-10 lg:p-12 min-h-[320px] sm:min-h-[420px] flex flex-col justify-end">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="inline-flex w-fit items-center gap-2 px-5 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-5"
                  >
                    <span className="text-xl">💼</span>
                    <span className="text-sm font-medium text-gray-700 Ovo">
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
                    {project.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="text-white/85 max-w-2xl Ovo text-base sm:text-lg"
                  >
                    {project.description}
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
                  <p className="text-gray-600 Ovo leading-relaxed">
                    This is a placeholder description for now. When you’re ready
                    to wire the backend, we can expand each project with real
                    details (features, tech stack, links, screenshots).
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <motion.div
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm inline-flex items-center justify-center gap-2"
                    >
                      <Link
                        href="/#contact"
                        className="absolute inset-0"
                        aria-label="Discuss this project"
                      />
                      <span>Discuss this project</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 rounded-full border-2 border-gray-300 bg-white text-gray-700 font-medium hover:border-purple-500 hover:bg-gray-50 transition-all duration-300 shadow-md text-sm inline-flex items-center justify-center gap-2"
                    >
                      <Link
                        href="/projects"
                        className="absolute inset-0"
                        aria-label="Browse more projects"
                      />
                      <Image
                        src={assets.right_arrow_bold}
                        alt=""
                        className="w-4 h-4 rotate-180"
                      />
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
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-500 Ovo">Type</span>
                      <span className="font-medium Ovo">
                        {project.description}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-500 Ovo">Slug</span>
                      <span className="font-medium Ovo">{String(slug)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-500 Ovo">More</span>
                      <span className="font-medium Ovo">Coming soon</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                    <p className="text-gray-700 Ovo text-sm leading-relaxed">
                      Want real project content here? Add fields to `workData`
                      (like `stack`, `links`, `highlights`) and I’ll wire it
                      into this page.
                    </p>
                  </div>
                </motion.aside>
              </div>
            </div>
          )}
        </div>

        {/* Bottom decorative element */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      </main>

      <Footer />
    </>
  );
};

export default ProjectDetailsPage;
