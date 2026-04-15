import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

import { getSettingsPublic } from "@/app/actions/settingsActions";

export const dynamic = "force-dynamic";

export default async function PagesLayout({ children }) {
  const settingsResult = await getSettingsPublic();
  const settings = settingsResult?.settings ?? null;

  return (
    <>
      <Navbar />
      {children}
      <Footer settings={settings} />
    </>
  );
}
