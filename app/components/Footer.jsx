import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Mail } from "lucide-react";

const FALLBACK_SETTINGS = {
  display_name: "Emmanuel Pam",
  public_email: "emmanuelpam03@gmail.com",
  github_url: "https://github.com/emmanuelpam03",
  linkedin_url: null,
};

const Footer = ({ settings = null }) => {
  const hasSettings = Boolean(settings && typeof settings === "object");

  const displayName =
    settings &&
    typeof settings?.display_name === "string" &&
    settings.display_name.trim()
      ? settings.display_name.trim()
      : FALLBACK_SETTINGS.display_name;

  const publicEmail =
    settings &&
    typeof settings?.public_email === "string" &&
    settings.public_email.trim()
      ? settings.public_email.trim()
      : FALLBACK_SETTINGS.public_email;

  const githubUrl = hasSettings
    ? typeof settings?.github_url === "string" && settings.github_url.trim()
      ? settings.github_url.trim()
      : null
    : FALLBACK_SETTINGS.github_url;

  const linkedinUrl = hasSettings
    ? typeof settings?.linkedin_url === "string" && settings.linkedin_url.trim()
      ? settings.linkedin_url.trim()
      : null
    : FALLBACK_SETTINGS.linkedin_url;

  const year = new Date().getFullYear();

  const socials = [
    githubUrl ? { label: "Github", href: githubUrl } : null,
    linkedinUrl ? { label: "LinkedIn", href: linkedinUrl } : null,
  ].filter(Boolean);

  return (
    <div className="mt-20">
      <div className="text-center">
        <Image src={assets.logo} alt="" className="w-40 mx-auto mb-2" />
        <div className="w-max flex items-center gap-2 mx-auto mb-2 text-base">
          <Mail className="w-5 h-5 text-gray-700" aria-hidden="true" />
          <span>{publicEmail}</span>
        </div>
      </div>

      <div className="text-center sm:flex items-center justify-between border-t border-gray-400 mx-[10%] mt-12 py-6">
        <p>
          © {year} {displayName}. All rights reserved.
        </p>

        {socials.length ? (
          <ul className="flex items-center gap-10 justify-center mt-4 sm:mt-0">
            {socials.map((item) => (
              <li key={item.href}>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default Footer;
