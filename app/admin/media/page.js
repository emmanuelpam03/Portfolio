export const metadata = {
  title: "Admin Media | Portfolio",
};

export default function AdminMediaPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
              <span className="text-xl">🖼️</span>
              <span className="text-sm font-medium text-gray-700 Ovo">
                Media
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-2">
              Media library
            </h2>
            <p className="text-gray-600 Ovo max-w-2xl">
              Upload once, reuse anywhere. Later this will connect to Cloudinary
              and show what projects are using each asset.
            </p>
          </div>

          <div className="w-full lg:w-auto flex items-center gap-3">
            <button
              type="button"
              className="w-full lg:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm"
            >
              Upload (coming soon)
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
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* Upload card */}
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 border border-gray-200 flex items-center justify-center text-xl">
                ⬆️
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 Ovo">
                  Upload assets
                </h3>
                <p className="text-sm text-gray-600 Ovo mt-1">
                  Drag & drop images/videos here (Cloudinary integration later).
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["JPG/PNG/WebP", "MP4", "Thumbnails", "Re-usable"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full text-xs font-medium border border-gray-200"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-blue-50/40 p-5">
              <p className="text-sm text-gray-700 Ovo">Nothing uploaded yet.</p>
              <p className="text-xs text-gray-500 Ovo mt-1">
                When wired, uploads will appear instantly in the grid.
              </p>
            </div>
          </div>

          {/* Usage info */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 Ovo">
              How this is used
            </h3>
            <p className="text-sm text-gray-600 Ovo mt-2">
              You’ll attach assets to projects from the project editor.
            </p>

            <div className="mt-5 grid gap-3">
              {[
                {
                  title: "Upload once",
                  desc: "Keep all assets in one place.",
                },
                {
                  title: "Reuse across projects",
                  desc: "Use the same image/video multiple times.",
                },
                {
                  title: "See usage",
                  desc: "Later: show what projects use each asset.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-4"
                >
                  <p className="text-sm font-semibold text-gray-900 Ovo">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600 Ovo mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid placeholder */}
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900 Ovo">Library</h3>
            <p className="text-xs text-gray-500 Ovo">0 items</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="h-full w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                  <div className="text-center px-4">
                    <p className="text-2xl">📄</p>
                    <p className="text-xs text-gray-600 Ovo mt-2">
                      Placeholder
                    </p>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs text-white Ovo">Actions later</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
