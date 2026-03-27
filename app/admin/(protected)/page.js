export const metadata = {
  title: "Admin Dashboard | Portfolio",
};

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
          <span className="text-xl">🏠</span>
          <span className="text-sm font-medium text-gray-700 Ovo">
            Dashboard
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          Admin overview
        </h2>
        <p className="text-gray-600 Ovo mb-8 max-w-2xl">
          Quick shortcuts and stats (design-only).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: "Projects", value: "—", hint: "Manage portfolio work" },
            { title: "About", value: "—", hint: "Edit about content" },
            { title: "Media", value: "—", hint: "Upload images" },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-6"
            >
              <p className="text-sm font-semibold text-gray-900 Ovo">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 Ovo mt-2">
                {card.value}
              </p>
              <p className="text-xs text-gray-600 Ovo mt-2">{card.hint}</p>
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
