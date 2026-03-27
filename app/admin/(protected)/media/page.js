export const metadata = {
  title: "Admin Media | Portfolio",
};

export default function AdminMediaPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
          <span className="text-xl">🖼️</span>
          <span className="text-sm font-medium text-gray-700 Ovo">Media</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          Media library
        </h2>
        <p className="text-gray-600 Ovo mb-8 max-w-2xl">
          Upload and manage images (design-only).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-lg p-6">
            <p className="text-sm font-semibold text-gray-900 Ovo">Upload</p>
            <p className="text-xs text-gray-600 Ovo mt-1">
              Connect Cloudinary later.
            </p>

            <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-6 text-center">
              <p className="text-sm text-gray-700 Ovo">Drop files here</p>
              <p className="text-xs text-gray-500 Ovo mt-2">or</p>
              <button
                type="button"
                className="mt-3 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
              >
                Browse
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-900 Ovo">
                Your files
              </p>
              <p className="text-xs text-gray-500 Ovo">0 items</p>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/40 to-purple-50/40"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
