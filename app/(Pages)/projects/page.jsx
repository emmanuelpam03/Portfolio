import ProjectsPageClient from "./ProjectsPageClient";

import { getPublishedProjects } from "@/app/actions/projectsActions";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects().catch((error) => {
    console.error("Failed to load published projects", error);
    return [];
  });

  return <ProjectsPageClient projects={projects} />;
}
