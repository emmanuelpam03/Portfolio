import { assets, serviceData } from "@/assets/assets";
import Image from "next/image";
import React from "react";
import { motion } from "motion/react";

const Services = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      id="services"
      className="relative w-full px-[12%] py-20 scroll-mt-20 bg-gradient-to-b from-blue-50/30 via-purple-50/20 to-white overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>

      {/* Section Header */}
      <div className="relative text-center mb-16">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full border border-purple-200 mb-4"
        >
          <span className="text-xl">✨</span>
          <span className="text-sm font-medium text-gray-700 Ovo">
            What I Offer
          </span>
        </motion.div>

        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold Ovo bg-gradient-to-r from-gray-900 via-purple-800 to-blue-700 bg-clip-text text-transparent mb-6"
        >
          My Services
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg Ovo leading-relaxed"
        >
          I build fast, scalable front-end experiences using React and Next.js,
          focused on performance and clean UI.
        </motion.p>
      </div>

      {/* Services Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
      >
        {serviceData.map(({ icon, title, link, description }, index) => (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ y: -8, scale: 1.02 }}
            key={index}
            className="group relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
          >
            {/* Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Decorative corner element */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>

            <div className="relative z-10 space-y-4">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md">
                <Image src={icon} alt={title} className="w-8 h-8" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                {title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-6 min-h-[3rem]">
                {description}
              </p>

              {/* Read More Link */}
              <a
                href={link}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:text-purple-600 mt-4 group-hover:gap-3 transition-all duration-300"
              >
                <span>Read more</span>
                <Image
                  src={assets.right_arrow}
                  alt=""
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                />
              </a>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="relative text-center mt-20"
      >
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xl">
          <div className="flex-1 text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Have a project in mind?
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Let's work together to bring your ideas to life
            </p>
          </div>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
          >
            <span>Get in Touch</span>
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
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Services;
