import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <div className="mt-20">
      <div className="text-center">
        <Image src={assets.logo} alt="" className="w-40 mx-auto mb-2" />
        <div className="w-max flex items-center gap-2 mx-auto mb-2 text-base">
          <Mail className="w-5 h-5 text-gray-700" aria-hidden="true" />
          <span>emmanuelpam03@gmail.com</span>
        </div>
      </div>

      <div className="text-center sm:flex items-center justify-between border-t border-gray-400 mx-[10%] mt-12 py-6">
        <p>© 2025 Emmanuel Pam. All rights reserved.</p>
        <ul className="flex items-center gap-10 justify-center mt-4 sm:mt-0">
          <li>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/emmanuelpam03"
            >
              Github
            </Link>
          </li>
          <li>
            <Link target="_blank" rel="noopener noreferrer" href="">
              LinkedIn
            </Link>
          </li>
          <li>
            <Link target="_blank" rel="noopener noreferrer" href="">
              Instagram
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
