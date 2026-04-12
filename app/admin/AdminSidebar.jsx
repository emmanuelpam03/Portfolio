"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Folder,
  Home,
  Image as ImageIcon,
  Puzzle,
  Settings,
  User,
  Wrench,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Projects", href: "/admin/projects", icon: Folder },
  { label: "About", href: "/admin/about", icon: User },
  { label: "Services", href: "/admin/services", icon: Puzzle },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const isActive = (pathname, href) => {
  if (!pathname) return false;
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-lg p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-4">
            <Wrench className="w-4 h-4 text-blue-700" aria-hidden="true" />
            <span className="text-base font-medium text-gray-800 Ovo">
              Admin
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="hidden lg:inline-flex px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
        >
          Site
        </Link>
      </div>

      <nav className="mt-5 grid gap-2">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 ${
                active
                  ? "border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50"
                  : "border-transparent bg-white hover:border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
              }`}
            >
              <span
                className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-lg transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-br from-blue-200 to-purple-200 border-blue-200"
                    : "bg-gradient-to-br from-blue-100 to-purple-100 border-gray-200"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active ? "text-blue-800" : "text-gray-700"
                  }`}
                  aria-hidden="true"
                />
              </span>
              <span
                className={`text-base font-medium Ovo transition-colors duration-300 ${
                  active ? "text-blue-800" : "text-gray-800"
                }`}
              >
                {item.label}
              </span>
              <ChevronRight
                className={`ml-auto w-5 h-5 transition-colors ${
                  active
                    ? "text-blue-700"
                    : "text-gray-400 group-hover:text-blue-700"
                }`}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
