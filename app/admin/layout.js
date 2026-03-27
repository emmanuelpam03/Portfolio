import Link from "next/link";

export const metadata = {
  title: "Admin | Portfolio",
};

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "🏠" },
  { label: "Projects", href: "/admin/projects", icon: "📁" },
  { label: "Media", href: "/admin/media", icon: "🖼️" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-purple-50/30 overflow-hidden">
      {/* Background decorative elements (matches site style) */}
      <div className="absolute top-32 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="relative w-full px-[6%] sm:px-[8%] lg:px-[10%] xl:px-[12%] pt-10 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-4">
                    <span className="text-lg">🛠️</span>
                    <span className="text-sm font-medium text-gray-700 Ovo">
                      Admin
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 Ovo">
                    Manage all site content (except contact messages).
                  </p>
                </div>

                <Link
                  href="/"
                  className="hidden lg:inline-flex px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                >
                  Site
                </Link>
              </div>

              <nav className="mt-5 grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 px-4 py-3 rounded-2xl border border-transparent bg-white hover:border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                  >
                    <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 border border-gray-200 flex items-center justify-center text-lg">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-800 Ovo">
                      {item.label}
                    </span>
                    <span className="ml-auto text-gray-400 group-hover:text-blue-700 transition-colors">
                      →
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-600 Ovo">
                  Note: contact messages are not stored here.
                </p>
                <p className="text-xs text-gray-500 Ovo mt-1">
                  You’ll receive them directly via email.
                </p>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="min-w-0">
            {/* Top bar (mobile/quick actions) */}
            <div className="lg:hidden mb-5 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 Ovo">Admin</p>
                <p className="text-xs text-gray-600 Ovo">Design-only</p>
              </div>
              <Link
                href="/"
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
              >
                Back to site
              </Link>
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
