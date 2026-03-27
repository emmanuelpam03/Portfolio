import Link from "next/link";

import { workData } from "@/assets/assets";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const metadata = {
  title: "Edit Project | Admin",
};

export default async function EditProjectPage({ params }) {
  const { slug } = await params;

  const project =
    workData.find((p) => slugify(p.title) === String(slug)) ?? null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${slug}`}
            className="px-5 py-2.5 rounded-full border-2 border-gray-300 bg-white text-gray-700 font-medium hover:border-purple-500 hover:bg-gray-50 transition-all duration-300 shadow-md text-sm"
          >
            Preview live page
          </Link>
        </div>
      </div>

      {!project ? (
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
            <span className="text-xl">🔎</span>
            <span className="text-sm font-medium text-gray-700 Ovo">
              Not found
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
            Project not found
          </h2>
          <p className="text-gray-600 Ovo max-w-2xl mx-auto">
            This slug doesn’t match any item in `workData`.
          </p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
            <span className="text-xl">✏️</span>
            <span className="text-sm font-medium text-gray-700 Ovo">
              Edit Project
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
            {project.title}
          </h2>
          <p className="text-gray-600 Ovo mb-8 max-w-2xl">
            Design-only editing scaffold. Later this will load/save from Neon.
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
                  defaultValue={project.title}
                  className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                  Slug (derived)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={slug}
                  readOnly
                  className="w-full p-3 outline-none border-[0.5px] border-gray-200 rounded-md bg-gray-50 text-gray-600"
                />
                <p className="text-xs text-gray-500 Ovo mt-2">
                  Slug editing can be added later.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                Short description
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={project.description}
                className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                Media
              </label>
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5">
                <p className="text-sm text-gray-600 Ovo">
                  Media manager UI will be added next.
                </p>
                <p className="text-xs text-gray-500 Ovo mt-1">
                  Target: support many images/videos per project.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-full border-2 border-gray-300 bg-white text-gray-700 font-medium hover:border-purple-500 hover:bg-gray-50 transition-all duration-300 shadow-md text-sm"
              >
                Delete (coming soon)
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm"
              >
                Save changes (coming soon)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
