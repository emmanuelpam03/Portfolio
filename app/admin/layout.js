import Link from "next/link";

import AdminSidebar from "@/app/admin/AdminSidebar";
import AdminMobileMenu from "@/app/admin/AdminMobileMenu";

export const metadata = {
  title: "Admin | Portfolio",
};

export default function AdminLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-purple-50/30 overflow-hidden">
      {/* Background decorative elements (matches site style) */}
      <div className="absolute top-32 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="relative w-full px-[6%] sm:px-[8%] lg:px-[10%] xl:px-[12%] pt-10 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Desktop fixed sidebar (fixed to viewport left for consistent alignment) */}
          <aside className="hidden lg:block fixed left-0 top-24 w-[320px] pl-[10%] xl:pl-[12%] pr-6">
            <div className="w-[280px]">
              <AdminSidebar />
            </div>
          </aside>

          {/* Main */}
          <main className="min-w-0 lg:pl-[320px]">
            {/* Top bar (mobile/quick actions) */}
            <div className="lg:hidden mb-5 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 Ovo">Admin</p>
                <p className="text-xs text-gray-600 Ovo">Design-only</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                >
                  Back to site
                </Link>

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
