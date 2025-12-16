import { assets, workData } from "@/assets/assets";
import Image from "next/image";
import React from "react";
import { motion } from "motion/react";

const Work = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      id="work"
      className="relative w-full px-[12%] py-20 scroll-mt-20 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/30 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>

      {/* Section Header */}
      <div className="relative text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-4"
        >
          <span className="text-xl">💼</span>
          <span className="text-sm font-medium text-gray-700 Ovo">My Portfolio</span>
        </motion.div>

        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-6"
        >
          My Latest Work
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg Ovo leading-relaxed"
        >
          A selection of recent projects showcasing my approach to building fast,
          responsive, and user-focused web interfaces.
        </motion.p>
      </div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16"
      >
        {workData.map((project, index) => (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ y: -8 }}
            key={index}
            className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${project.bgImage})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

            {/* Decorative border that appears on hover */}
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-blue-400/50 rounded-2xl transition-all duration-500"></div>

            {/* Content Card */}
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {project.title}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex-shrink-0 w-11 h-11 rounded-full border-2 border-gray-800 flex items-center justify-center shadow-[3px_3px_0_#000] group-hover:shadow-[5px_5px_0_#000] group-hover:bg-gradient-to-br group-hover:from-blue-400 group-hover:to-purple-400 group-hover:border-transparent transition-all duration-300">
                    <Image 
                      src={assets.send_icon} 
                      alt="View project" 
                      className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" 
                    />
                  </div>
                </div>

                {/* Tech tags - Optional if you have tech data */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {/* You can add tech stack tags here if available in your data */}
                </div>
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Show More Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="flex justify-center"
      >
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href=""
          className="group relative px-8 py-4 bg-white border-2 border-gray-300 rounded-full font-medium text-gray-700 hover:border-purple-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-3 overflow-hidden"
        >
          {/* Animated background on hover */}
          <span className="relative z-10 flex items-center gap-3">
            Show More Projects
            <Image
              src={assets.right_arrow_bold}
              alt="Right arrow"
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
            />
          </span>
        </motion.a>
      </motion.div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </motion.div>
  );
};

export default Work;