import About from "@/app/components/About";
import Contact from "@/app/components/Contact";
import Header from "@/app/components/Header";
import Services from "@/app/components/Services";
import Work from "@/app/components/Work";

import { getAboutPublic } from "@/app/actions/aboutActions";
import { getSettingsPublic } from "@/app/actions/settingsActions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [aboutResult, settingsResult] = await Promise.all([
    getAboutPublic(),
    getSettingsPublic(),
  ]);

  const about = aboutResult?.about ?? null;
  const settings = settingsResult?.settings ?? null;

  return (
    <>
      <Header
        heroImage={about?.hero_image ?? null}
        heroLanguages={about?.hero_languages ?? []}
        settings={settings}
      />
      <About about={about} />
      <Services />
      <Work />
      <Contact />
    </>
  );
}
