import ProjectDetailsClient from "./ProjectDetailsClient";

import { findPublishedProjectBySlug } from "@/app/actions/projectsActions";

export const dynamic = "force-dynamic";

export default async function ProjectDetailsPage({ params }) {
  const slug = params?.slug ? String(params.slug) : "";

  const project = slug
    ? await findPublishedProjectBySlug(slug).catch((error) => {
        console.error("Failed to load project", error);
        return null;
      })
    : null;

  return <ProjectDetailsClient slug={slug} project={project} />;
}
