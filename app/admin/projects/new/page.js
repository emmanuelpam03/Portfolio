import Link from "next/link";

export const metadata = {
  title: "New Project | Admin",
};

export default function NewProjectPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-gray-700 font-medium hover:text-blue-700 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="Ovo">Back to Projects</span>
        </Link>
      </div>

      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
          <span className="text-xl">➕</span>
          <span className="text-sm font-medium text-gray-700 Ovo">
            Create Project
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          New project
        </h2>
        <p className="text-gray-600 Ovo mb-8 max-w-2xl">
          Design-only form scaffold. Later this will save to Neon and upload
          images/videos to Cloudinary.
        </p>

        <form className="grid grid-cols-1 gap-5" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. E-commerce Landing Page"
                className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
              />
              <p className="text-xs text-gray-500 Ovo mt-2">
                Slug can be generated from title later.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Frontend / UI"
                className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              Short description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="A short summary shown on cards"
              className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                Live URL
              </label>
              <input
                type="url"
                name="liveUrl"
                placeholder="https://..."
                className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                Repo URL
              </label>
              <input
                type="url"
                name="repoUrl"
                placeholder="https://github.com/..."
                className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              Cover image
            </label>
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5">
              <p className="text-sm text-gray-600 Ovo">
                Upload UI will be added later.
              </p>
              <p className="text-xs text-gray-500 Ovo mt-1">
                Target: Cloudinary upload → store URL.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3">
            <Link
              href="/admin/projects"
              className="w-full sm:w-auto px-6 py-3 rounded-full border-2 border-gray-300 bg-white text-gray-700 font-medium hover:border-purple-500 hover:bg-gray-50 transition-all duration-300 shadow-md text-sm text-center"
            >
              Cancel
            </Link>
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm"
            >
              Save (coming soon)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
