import { serviceData } from "@/assets/assets";
import { Puzzle } from "lucide-react";

export const metadata = {
  title: "Admin Services | Portfolio",
};

export default function AdminServicesPage() {
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
          Manage your services list (design-only).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {serviceData.map((s) => (
            <div
              key={s.title}
              className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-lg p-6"
            >
              <p className="text-sm font-semibold text-gray-900 Ovo">
                {s.title}
              </p>
              <p className="text-base text-gray-700 Ovo mt-2">
                {s.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-base font-medium"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-red-600 text-base font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-base"
          >
            Save (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
}
