export const metadata = {
  title: "Admin About | Portfolio",
};

export default function AdminAboutPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
          <span className="text-xl">👋</span>
          <span className="text-sm font-medium text-gray-700 Ovo">About</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          About content
        </h2>
        <p className="text-gray-600 Ovo mb-8 max-w-2xl">
          Edit what shows in the About section (design-only).
        </p>

        <div className="rounded-3xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-6">
          <p className="text-sm text-gray-700 Ovo">
            About editor UI was temporarily removed while separating login
            layout. Tell me if you want the full About editor restored here.
          </p>
        </div>
      </div>
    </div>
  );
}
