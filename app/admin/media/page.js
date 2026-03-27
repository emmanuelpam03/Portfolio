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
          This will manage uploads for project images/videos later (Cloudinary).
        </p>

        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6">
          <p className="text-sm text-gray-700 Ovo">No media yet.</p>
          <p className="text-xs text-gray-500 Ovo mt-2">
            Next: upload dropzone + list/grid + attach to projects.
          </p>
        </div>
      </div>
    </div>
  );
}
