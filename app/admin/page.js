import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 Ovo">Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
              <p className="text-sm text-gray-600 Ovo mt-2">
                Connect this to your DB later.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 border border-gray-200 flex items-center justify-center">
              <span className="text-xl">💼</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 Ovo">Media</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
              <p className="text-sm text-gray-600 Ovo mt-2">
                Planned for Cloudinary.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 border border-gray-200 flex items-center justify-center">
              <span className="text-xl">🖼️</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 Ovo">Status</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">Design</p>
              <p className="text-sm text-gray-600 Ovo mt-2">
                Auth + backend coming next.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-blue-100 border border-gray-200 flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary actions */}
      <div className="mt-8 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 Ovo">
              Start managing your content
            </h2>
            <p className="text-gray-600 Ovo mt-1">
              Begin with projects: list, create, and edit.
            </p>
          </div>

          <Link
            href="/admin/projects"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm"
          >
            Go to Projects
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
