import ProjectDetailsClient from "./ProjectDetailsClient";

import { findPublishedProjectBySlug } from "@/app/actions/projectsActions";

export const dynamic = "force-dynamic";

export default async function ProjectDetailsPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug ? String(resolvedParams.slug) : "";

  const project = slug
    ? await findPublishedProjectBySlug(slug).catch((error) => {
        console.error("Failed to load project", error);
        return null;
      })
    : null;

  return <ProjectDetailsClient slug={slug} project={project} />;
}
