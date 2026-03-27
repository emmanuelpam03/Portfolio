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
  title: "Admin Projects | Portfolio",
};

export default function AdminProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
        <div>
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-4">
            <span className="text-xl">📁</span>
            <span className="text-sm font-medium text-gray-700 Ovo">
              Projects
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 Ovo">
            Your projects
          </h2>
          <p className="text-gray-600 Ovo mt-1">
            Read-only view from your current `workData` for now.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm"
        >
          New project
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {workData.map((project) => {
          const slug = slugify(project.title);
          return (
            <div
              key={slug}
              className="group bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 Ovo mt-1 line-clamp-2">
                    {project.description}
                  </p>
                  <p className="text-xs text-gray-500 Ovo mt-3">
                    Slug: <span className="font-medium">{slug}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/projects/${slug}`}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/admin/projects/${slug}`}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                  >
                    Edit
                  </Link>
                </div>
              </div>

              <div className="mt-5 h-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          );
        })}
      </div>

      <div className="mt-10 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
        <p className="text-sm text-gray-600 Ovo">
          Next: we’ll add the “New project” and “Edit project” forms (still
          design-only), then later connect them to Neon + Cloudinary.
        </p>
      </div>
    </div>
  );
}
