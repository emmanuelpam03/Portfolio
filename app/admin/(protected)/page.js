export const metadata = {
  title: "Admin Dashboard | Portfolio",
};

import Link from "next/link";

const QUICK_ACTIONS = [
  {
    label: "New project",
    href: "/admin/projects/new",
    icon: "➕",
    description: "Add a new portfolio project",
  },
  {
    label: "Upload media",
    href: "/admin/media",
    icon: "🖼️",
    description: "Manage images and uploads",
  },
  {
    label: "Edit About",
    href: "/admin/about",
    icon: "👋",
    description: "Update About text and tools",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "⚙️",
    description: "Update public site settings",
  },
];

const SNAPSHOT = [
  {
    title: "Projects",
    value: "—",
    meta: "Drafts: —",
    hint: "Total projects in your portfolio",
  },
  {
    title: "Featured",
    value: "—",
    meta: "Shown on homepage",
    hint: "Projects highlighted on the landing page",
  },
  {
    title: "Media",
    value: "—",
    meta: "Last upload: —",
    hint: "Total assets in your library",
  },
  {
    title: "Last updated",
    value: "—",
    meta: "Across admin content",
    hint: "Most recent content change",
  },
];

const RECENT_ACTIVITY = [
  { title: "Updated About text", detail: "About", when: "—" },
  { title: "Edited a project", detail: "Projects", when: "—" },
  { title: "Uploaded a media item", detail: "Media", when: "—" },
  { title: "Changed settings", detail: "Settings", when: "—" },
  { title: "Signed in", detail: "Auth", when: "—" },
];

const HEALTH = [
  {
    title: "Database",
    status: "Pending",
    hint: "Connect Neon tables for content storage",
  },
  {
    title: "Email (Resend)",
    status: "Pending",
    hint: "Used for admin magic-link sign-in",
  },
  {
    title: "Auth",
    status: "Enabled",
    hint: "Admin-only access is enforced",
  },
  {
    title: "Deployment",
    status: "Pending",
    hint: "Set env vars in your hosting dashboard",
  },
];

const NEEDS_ATTENTION = [
  { title: "Projects missing cover image", value: "—" },
  { title: "Projects missing live URL", value: "—" },
  { title: "Projects missing GitHub URL", value: "—" },
  { title: "Projects missing description", value: "—" },
];

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
                Quick actions
              </h3>
              <p className="text-sm text-gray-600 Ovo">
                Jump to the most common tasks.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUICK_ACTIONS.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group rounded-3xl border border-gray-200 bg-white p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-11 h-11 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-lg">
                          {action.icon}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 Ovo">
                            {action.label}
                          </p>
                          <p className="text-xs text-gray-600 Ovo mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-gray-400 group-hover:text-blue-700 transition-colors">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
                Content snapshot
              </h3>
              <p className="text-sm text-gray-600 Ovo">
                A high-level summary of your content.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SNAPSHOT.map((card) => (
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
                    <p className="text-xs text-gray-700 Ovo mt-1">
                      {card.meta}
                    </p>
                    <p className="text-xs text-gray-600 Ovo mt-2">
                      {card.hint}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
                    Recent activity
                  </h3>
                  <p className="text-sm text-gray-600 Ovo">
                    Your most recent admin changes.
                  </p>
                </div>
                <p className="text-xs text-gray-500 Ovo">Last 5</p>
              </div>

              <div className="mt-5 grid gap-3">
                {RECENT_ACTIVITY.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="rounded-2xl border border-gray-200 bg-white p-4 flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 Ovo truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-600 Ovo mt-1">
                        {item.detail}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 Ovo whitespace-nowrap">
                      {item.when}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
                Publishing & health
              </h3>
              <p className="text-sm text-gray-600 Ovo">
                Checks you’ll connect to real data soon.
              </p>

              <div className="mt-5 grid gap-3">
                {HEALTH.map((check) => (
                  <div
                    key={check.title}
                    className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900 Ovo">
                        {check.title}
                      </p>
                      <span className="px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-700 text-xs font-medium">
                        {check.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 Ovo mt-2">
                      {check.hint}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
                    Needs attention
                  </h3>
                  <p className="text-sm text-gray-600 Ovo">
                    Quick checks to keep content complete.
                  </p>
                </div>
                <Link
                  href="/admin/projects"
                  className="text-sm font-medium text-blue-700 hover:text-blue-800 Ovo"
                >
                  Projects
                </Link>
              </div>

              <div className="mt-5 grid gap-3">
                {NEEDS_ATTENTION.map((row) => (
                  <div
                    key={row.title}
                    className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center justify-between gap-4"
                  >
                    <p className="text-sm text-gray-800 Ovo">{row.title}</p>
                    <p className="text-sm font-semibold text-gray-900 Ovo whitespace-nowrap">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-4">
                <p className="text-xs text-gray-600 Ovo">
                  Tip: when the DB is connected, these will show real counts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
