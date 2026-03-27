import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="mt-20">
      <div className="text-center">
        <Image src={assets.logo} alt="" className="w-40 mx-auto mb-2" />
        <div className="w-max flex items-center gap-2 mx-auto mb-2">
          <Image src={assets.mail_icon} alt="" className="w-6" />
          emmanuelpam03@gmail.com
        </div>
      </div>

      <div className="text-center sm:flex items-center justify-between border-t border-gray-400 mx-[10%] mt-12 py-6">
        <p>© 2025 Emmanuel Pam. All rights reserved.</p>
        <ul className="flex items-center gap-10 justify-center mt-4 sm:mt-0">
          <li>
            <Link target="_blank" href="https://github.com/emmanuelpam03">
              Github
            </Link>
          </li>
          <li>
            <Link target="_blank" href="">
              LinkedIn
            </Link>
          </li>
          <li>
            <Link target="_blank" href="">
              Instagram
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
