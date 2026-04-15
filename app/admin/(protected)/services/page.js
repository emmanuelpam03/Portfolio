import { unstable_rethrow } from "next/navigation";
import { Puzzle } from "lucide-react";

import { requireAdmin } from "@/app/lib/adminSession";
import { getServicesAdmin } from "@/app/actions/servicesActions";

import AdminServicesForm from "./AdminServicesForm";

export const metadata = {
  title: "Admin Services | Portfolio",
};

export default async function AdminServicesPage() {
  await requireAdmin();

  let servicesResult = { ok: false, content: null, services: [], message: null };

  try {
    servicesResult = (await getServicesAdmin()) ?? servicesResult;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Failed to load admin services", error);
    servicesResult = {
      ok: false,
      content: null,
      services: [],
      message: "Unable to load Services.",
    };
  }

  const setupMessage = servicesResult?.message || null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
          <Puzzle className="w-4 h-4 text-blue-700" aria-hidden="true" />
          <span className="text-base font-medium text-gray-800 Ovo">
            Services
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          Services
        </h2>
        <p className="text-gray-600 Ovo mb-8 max-w-2xl">
          Edit the Services section copy, CTA, and list items.
        </p>

        <AdminServicesForm
          initialContent={servicesResult?.content ?? null}
          initialServices={servicesResult?.services ?? []}
          setupMessage={setupMessage}
        />
      </div>
    </div>
  );
}
