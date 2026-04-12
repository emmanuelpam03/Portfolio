"use client";

import { useState } from "react";
import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import AdminSidebar from "@/app/admin/AdminSidebar";
import AdminMobileMenu from "@/app/admin/AdminMobileMenu";
import AdminLogoutButton from "@/app/admin/AdminLogoutButton";

export default function AdminShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-purple-50/30 overflow-hidden">
      <div className="absolute top-32 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="relative w-full px-[6%] sm:px-[8%] pt-10 pb-16">
        <div className="max-w-7xl mx-auto">
          {isSidebarOpen && (
            <aside className="hidden lg:block fixed top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl pointer-events-none">
              <div className="admin-scroll pointer-events-auto w-[280px] max-h-[calc(100vh-2.5rem)] overflow-y-auto pr-2 pb-6">
                <AdminSidebar />
              </div>
            </aside>
          )}

          <main className={`min-w-0 ${isSidebarOpen ? "lg:pl-[320px]" : ""}`}>
            <div className="hidden lg:flex sticky top-10 z-50 mb-6 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-4 items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen((v) => !v)}
                  aria-expanded={isSidebarOpen}
                  aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
                  title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
                  className="w-11 h-11 rounded-xl border border-gray-200 bg-white text-gray-700 inline-flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                >
                  {isSidebarOpen ? (
                    <PanelLeftClose className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <PanelLeftOpen className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
                <div>
                  <p className="text-base font-semibold text-gray-900 Ovo">
                    Admin
                  </p>
                  <p className="text-sm text-gray-600 Ovo">
                    Manage your portfolio content
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-base font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                >
                  Back to site
                </Link>
                <AdminLogoutButton />
              </div>
            </div>

            <div className="lg:hidden mb-5 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-gray-900 Ovo">
                  Admin
                </p>
                <p className="text-sm text-gray-600 Ovo">
                  Manage your portfolio content
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-base font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                >
                  Back to site
                </Link>

                <AdminLogoutButton />

                <AdminMobileMenu />
              </div>
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
