import { unstable_rethrow } from "next/navigation";
import { Settings } from "lucide-react";

import { requireAdmin } from "@/app/lib/adminSession";
import { getSettingsAdmin } from "@/app/actions/settingsActions";

import AdminSettingsForm from "./AdminSettingsForm";

export const metadata = {
  title: "Admin Settings | Portfolio",
};

export default async function AdminSettingsPage() {
  await requireAdmin();

  let settingsResult = { ok: false, settings: null, message: null };

  try {
    settingsResult = (await getSettingsAdmin()) ?? settingsResult;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Failed to load admin settings", error);
    settingsResult = {
      ok: false,
      settings: null,
      message: "Unable to load Settings.",
    };
  }

  const setupMessage = settingsResult?.message || null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
          <Settings className="w-4 h-4 text-blue-700" aria-hidden="true" />
          <span className="text-base font-medium text-gray-800 Ovo">
            Settings
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          Site settings
        </h2>
        <p className="text-gray-600 Ovo mb-8 max-w-2xl">
          Manage website content like socials, hero text, and footer details.
        </p>

        <AdminSettingsForm
          initialSettings={settingsResult?.settings ?? null}
          setupMessage={setupMessage}
        />
      </div>
    </div>
  );
}
