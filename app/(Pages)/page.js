import About from "@/app/components/About";
import Contact from "@/app/components/Contact";
import Header from "@/app/components/Header";
import Services from "@/app/components/Services";
import Work from "@/app/components/Work";

import { getAboutPublic } from "@/app/actions/aboutActions";
import { getSettingsPublic } from "@/app/actions/settingsActions";
import { getServicesPublic } from "@/app/actions/servicesActions";
import {
  getFeaturedProjects,
  getPublishedProjects,
} from "@/app/actions/projectsActions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [aboutResult, settingsResult, servicesResult, featuredProjectsResult] =
    await Promise.all([
      getAboutPublic(),
      getSettingsPublic(),
      getServicesPublic(),
      getFeaturedProjects(6).catch((error) => {
        console.error("Failed to load featured projects", error);
        return [];
      }),
    ]);

  const about = aboutResult?.about ?? null;
  const settings = settingsResult?.settings ?? null;
  const servicesContent = servicesResult?.content ?? null;
  const services = Array.isArray(servicesResult?.services)
    ? servicesResult.services
    : [];

  let projects = Array.isArray(featuredProjectsResult)
    ? featuredProjectsResult
    : [];

  if (!projects.length) {
    const publishedProjects = await getPublishedProjects().catch((error) => {
      console.error("Failed to load published projects", error);
      return [];
    });

    projects = Array.isArray(publishedProjects)
      ? publishedProjects.slice(0, 6)
      : [];
  }

  return (
    <>
      <Header
        heroImage={about?.hero_image ?? null}
        heroLanguages={about?.hero_languages ?? []}
        settings={settings}
      />
      <About about={about} />
      <Services content={servicesContent} services={services} />
      <Work projects={projects} />
      <Contact />
    </>
  );
}
