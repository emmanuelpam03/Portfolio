export const metadata = {
  title: "Admin Settings | Portfolio",
};

export default function AdminSettingsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
          <span className="text-xl">⚙️</span>
          <span className="text-sm font-medium text-gray-700 Ovo">
            Settings
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          Site settings
        </h2>
        <p className="text-gray-600 Ovo mb-8 max-w-2xl">
          Manage website content like socials, hero text, and about details.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">CV</h3>
            <p className="text-sm text-gray-600 Ovo mb-5">
              Upload/replace your resume file (design-only).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-5">
                <p className="text-sm font-medium text-gray-800 Ovo">
                  Current file
                </p>
                <p className="text-xs text-gray-600 Ovo mt-1">
                  No file connected yet.
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-red-600 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                  Upload new CV
                </label>
                <input
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                />
                <p className="text-xs text-gray-500 Ovo mt-2">
                  Recommended: PDF.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Tech tags</h3>
            <p className="text-sm text-gray-600 Ovo mb-5">
              Edit the pill tags shown on the homepage (design-only).
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {["React", "Next.js", "Tailwind", "Node.js"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 text-sm text-gray-800"
                >
                  <span className="Ovo">{tag}</span>
                  <button type="button" className="text-gray-500">
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                name="newTag"
                placeholder="Add a tag (e.g. PostgreSQL)"
                className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
              />
              <button
                type="button"
                className="w-full px-5 py-3 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
              >
                Add tag
              </button>
            </div>
          </div>
        </div>

        <form className="grid grid-cols-1 gap-5" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                Display name
              </label>
              <input
                type="text"
                name="displayName"
                placeholder="Emmanuel Pam"
                className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Based in ..."
                className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              Public email
            </label>
            <input
              type="email"
              name="publicEmail"
              placeholder="emmanuelpam03@gmail.com"
              className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
            />
            <p className="text-xs text-gray-500 Ovo mt-2">
              This is the email displayed on your homepage/footer.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              Hero headline
            </label>
            <input
              type="text"
              name="headline"
              placeholder="Front-End Web Developer"
              className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              Short bio
            </label>
            <textarea
              name="bio"
              rows={4}
              placeholder="A short description shown on the homepage"
              className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                name="github"
                placeholder="https://github.com/..."
                className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/..."
                className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm"
            >
              Save (coming soon)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
