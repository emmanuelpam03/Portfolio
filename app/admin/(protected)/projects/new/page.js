export const metadata = {
  title: "New Project | Admin",
};

export default function AdminNewProjectPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
          <span className="text-xl">➕</span>
          <span className="text-sm font-medium text-gray-700 Ovo">
            Projects
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          New project
        </h2>
        <p className="text-gray-600 Ovo mb-8 max-w-2xl">
          Create a new project (design-only).
        </p>

        <form className="grid grid-cols-1 gap-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Project name"
              className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              Short description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="What is this project about?"
              className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm"
            >
              Save (coming soon)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
