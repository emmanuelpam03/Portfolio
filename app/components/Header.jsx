"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Briefcase, Download, Hand, MapPin } from "lucide-react";

const Header = ({ heroImage = null }) => {
  const heroSrc =
    heroImage && typeof heroImage?.url === "string" && heroImage.url
      ? heroImage.url
      : assets.profile_img;

  const heroAlt =
    heroImage && typeof heroImage?.alt === "string" && heroImage.alt
      ? heroImage.alt
      : "Emmanuel Pam";

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
              Hi! I&apos;m Emmanuel Pam
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <Hand className="w-5 h-5 text-gray-600" aria-hidden="true" />
              </motion.span>
            </h3>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl Ovo font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent">
                Front-End
              </span>
              <br />
              <span className="text-gray-800">Web Developer</span>
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
            <span>Based in Mauritius</span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl"
          >
            I build clean, user-friendly interfaces using modern frameworks like
            React and Next.js.
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

            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="/sample-resume.pdf"
              download
              className="px-6 py-3 rounded-full border-2 border-gray-300 bg-white text-gray-700 flex items-center gap-2 font-medium hover:border-purple-500 hover:bg-gray-50 transition-all duration-300 shadow-md text-base"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download CV</span>
            </motion.a>
          </motion.div>

          {/* Tech Stack Pills */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap gap-2 pt-2 justify-center lg:justify-start"
          >
            {["React", "Next.js", "TypeScript", "Tailwind"].map(
              (tech, index) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200"
                >
                  {tech}
                </span>
              ),
            )}
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
    </div>
  );
};

export default Header;
