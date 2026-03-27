import { serviceData } from "@/assets/assets";

export const metadata = {
  title: "Admin Services | Portfolio",
};

export default function AdminServicesPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
              <span className="text-xl">🧩</span>
              <span className="text-sm font-medium text-gray-700 Ovo">
                Services
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-2">
              My services
            </h2>
            <p className="text-gray-600 Ovo max-w-2xl">
              Manage the service cards shown on the homepage (design-only).
            </p>
          </div>

          <button
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm"
          >
            New service
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceData.map((service) => (
            <div
              key={service.title}
              className="group bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 Ovo mt-1 line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-red-600 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="mt-5 h-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm"
          >
            Save (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
}
