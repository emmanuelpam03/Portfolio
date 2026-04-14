import Link from "next/link";
import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";

import {
  getProjectBySlugAdmin,
  updateProjectAction,
} from "@/app/actions/projectsActions";

import { getMediaAssetsAdmin } from "@/app/actions/mediaActions";

import AdminProjectForm from "../AdminProjectForm";

export const metadata = {
  title: "Edit Project | Admin",
};

export default async function AdminEditProjectPage({ params }) {
  const slug = (await params)?.slug;
  if (!slug) notFound();

  const project = await getProjectBySlugAdmin(slug);

  if (!project) {
    notFound();
  }

  const { assets: mediaLibrary } = await getMediaAssetsAdmin({ limit: 120 });
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
              <Pencil className="w-4 h-4 text-blue-700" aria-hidden="true" />
              <span className="text-base font-medium text-gray-800 Ovo">
                Projects
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-2">
              Edit project
            </h2>
            <p className="text-gray-600 Ovo">Slug: {project.slug}</p>
          </div>

          <Link
            href="/admin/projects"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-200 bg-white text-gray-700 text-base font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-center"
          >
            Back
          </Link>
        </div>

        <div className="mt-8">
          <AdminProjectForm
            action={updateProjectAction}
            submitLabel="Save changes"
            initialProject={project}
            initialMedia={project.media}
            mediaLibrary={mediaLibrary}
          />
        </div>
      </div>
    </div>
  );
}
