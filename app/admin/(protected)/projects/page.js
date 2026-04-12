import Link from "next/link";
import { Folder } from "lucide-react";

import {
  deleteProjectAction,
  getAllProjectsAdmin,
} from "@/app/actions/projectsActions";

export const metadata = {
  title: "Admin Projects | Portfolio",
};

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
              <Folder className="w-4 h-4 text-blue-700" aria-hidden="true" />
              <span className="text-base font-medium text-gray-800 Ovo">
                Projects
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-2">
              Projects
            </h2>
            <p className="text-gray-600 Ovo">
              Add and edit portfolio projects (design-only).
            </p>
          </div>

          <Link
            href="/admin/projects/new"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-base text-center"
          >
            New project
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p) => (
            <div
              key={p.slug}
              className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-lg p-6"
            >
              <p className="text-sm font-semibold text-gray-900 Ovo">
                {p.title}
              </p>
              <p className="text-sm text-gray-600 Ovo mt-1">/{p.slug}</p>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/projects/${p.slug}`}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-base font-medium"
                >
                  Edit
                </Link>
                <form action={deleteProjectAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-red-600 text-base font-medium"
                  >
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
