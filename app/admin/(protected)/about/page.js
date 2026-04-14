import { unstable_rethrow } from "next/navigation";
import { User } from "lucide-react";

import { requireAdmin } from "@/app/lib/adminSession";
import { getAboutAdmin } from "@/app/actions/aboutActions";
import { getMediaAssetsAdmin } from "@/app/actions/mediaActions";

import AdminAboutForm from "./AdminAboutForm";

export const metadata = {
  title: "Admin About | Portfolio",
};

export default async function AdminAboutPage() {
  await requireAdmin();

  let aboutResult = { ok: false, about: null, message: null };
  let mediaResult = { ok: false, assets: [], message: null };

  try {
    aboutResult = (await getAboutAdmin()) ?? aboutResult;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Failed to load admin about", error);
    aboutResult = {
      ok: false,
      about: null,
      message: "Unable to load About content.",
    };
  }

  try {
    mediaResult = (await getMediaAssetsAdmin({ limit: 200 })) ?? mediaResult;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Failed to load media library", error);
    mediaResult = {
      ok: false,
      assets: [],
      message: "Unable to load media library.",
    };
  }

  const setupMessage = aboutResult?.message || mediaResult?.message || null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-linear-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
          <User className="w-4 h-4 text-blue-700" aria-hidden="true" />
          <span className="text-base font-medium text-gray-800 Ovo">About</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-linear-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          About content
        </h2>
        <p className="text-gray-600 Ovo mb-8 max-w-2xl">
          Edit what shows in the About section.
        </p>

        <AdminAboutForm
          initialAbout={aboutResult?.about ?? null}
          mediaLibrary={mediaResult?.assets ?? []}
          setupMessage={setupMessage}
        />
      </div>
    </div>
  );
}
