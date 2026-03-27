import Link from "next/link";

export const metadata = {
  title: "Edit Project | Admin",
};

export default async function AdminEditProjectPage({ params }) {
  const slug = (await params)?.slug;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
              <span className="text-xl">✏️</span>
              <span className="text-sm font-medium text-gray-700 Ovo">
                Projects
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-2">
              Edit project
            </h2>
            <p className="text-gray-600 Ovo">Slug: {slug}</p>
          </div>

          <Link
            href="/admin/projects"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-center"
          >
            Back
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={"Sample project"}
              className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={5}
              defaultValue={"Design-only editor"}
              className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm"
            >
              Save (coming soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
