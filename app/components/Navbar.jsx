import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { motion, AnimatePresence } from "motion/react";

const Navbar = () => {
  const [isScroll, setIsScroll] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sideMenuRef = useRef();

  const openMenu = () => {
    setIsMenuOpen(true);
    sideMenuRef.current.style.transform = "translateX(-16rem)";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    sideMenuRef.current.style.transform = "translateX(16rem)";
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }

      // Detect active section
      const sections = ["top", "about", "services", "work", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section === "top" ? "" : section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#top", id: "top" },
    { label: "About Me", href: "#about", id: "about" },
    { label: "Services", href: "#services", id: "services" },
    { label: "My Work", href: "#work", id: "work" },
    { label: "Contact Me", href: "#contact", id: "contact" },
  ];

  return (
    <>
      {/* Background Gradient */}
      <div className="fixed top-0 right-0 w-11/12 -z-10 translate-y-[-80%]">
        <Image src={assets.header_bg_color} alt="" className="w-full" />
      </div>

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full fixed px-5 lg:px-8 xl:px-[8%] py-4 flex items-center justify-between z-50 transition-all duration-300 ${
          isScroll 
            ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200" 
            : ""
        }`}
      >
        {/* Logo */}
        <motion.a 
          href="#top"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src={assets.logo}
            alt="Logo"
            className="w-28 cursor-pointer mr-14"
          />
        </motion.a>

        {/* Desktop Menu */}
        <ul
          className={`hidden md:flex items-center gap-2 lg:gap-3 rounded-full px-6 py-3 transition-all duration-300 ${
            isScroll 
              ? "bg-transparent" 
              : "bg-white/70 backdrop-blur-md shadow-md border border-gray-200"
          }`}
        >
          {navItems.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <a
                className={`Ovo px-4 py-2 rounded-full transition-all duration-300 relative group ${
                  activeSection === item.id
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`}
                href={item.href}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="activeSection"
                    className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Contact Button - Desktop */}
          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className="hidden lg:flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 Ovo font-medium"
          >
            Contact
            <Image src={assets.arrow_icon} alt="" className="w-3 invert" />
          </motion.a>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="block md:hidden ml-3 w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center shadow-md"
            onClick={openMenu}
          >
            <Image src={assets.menu_black} alt="Menu" className="w-5" />
          </motion.button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMenu}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <motion.ul
          ref={sideMenuRef}
          initial={{ x: "16rem" }}
          className="flex md:hidden flex-col gap-2 py-20 px-8 fixed -right-64 top-0 bottom-0 w-64 z-50 h-screen bg-gradient-to-b from-white to-blue-50/50 backdrop-blur-xl border-l border-gray-200 shadow-2xl transition-transform duration-500"
        >
          {/* Close Button */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-6 top-6 w-10 h-10 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg flex items-center justify-center cursor-pointer shadow-md"
            onClick={closeMenu}
          >
            <Image
              src={assets.close_black}
              alt="Close"
              className="w-4"
            />
          </motion.div>

          {/* Mobile Menu Items */}
          {navItems.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <a
                className={`Ovo block px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                }`}
                onClick={closeMenu}
                href={item.href}
              >
                {item.label}
              </a>
            </motion.li>
          ))}

          {/* Mobile Contact Button */}
          <motion.a
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            onClick={closeMenu}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-center font-semibold shadow-lg Ovo"
          >
            Get in Touch
          </motion.a>

          {/* Decorative element */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
        </motion.ul>
      </motion.nav>
    </>
  );
};

export default Navbar;