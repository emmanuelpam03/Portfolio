import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col items-center justify-center gap-4 pt-20">
      <div>
        <Image src={assets.profile_img} alt="" className="rounded-full w-36" />
      </div>
      <h3 className="flex items-end gap-2 text-xl md:text-2xl mb-3 Ovo">
        Hi! I&apos;m Emmanuel Pam
        <Image src={assets.hand_icon} alt="" className="w-6" />
      </h3>

      <h1 className="text-3xl sm:text-6xl lg:txt-[66px] Ovo">
        Front-End web developer based in Mauritius.
      </h1>
      <p className="max-w-2xl mx-auto Ovo">
        I&apos;m a frontend web developer focused on building clean,
        user-friendly interfaces using modern frameworks like React and Next.js,
        delivering high-quality solutions that enhance user experience.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
        <a
          href="#contact"
          className="px-10 py-3 border border-white rounded-full bg-black text-white flex items-center gap-2"
        >
          Contact me <Image src={assets.profile_img} alt="" className="w-4" />
        </a>

        <a
          href="/sample-resume.pdf"
          download
          className="px-10 py-3 border rounded-full flex items-center gap-2"
        >
          My Resume <Image src={assets.download_icon} alt="" className="w-4" />
        </a>
      </div>
    </div>
  );
};

export default Header;
