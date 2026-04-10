export const metadata = {
  title: "Admin Dashboard | Portfolio",
};

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Folder,
  Image as ImageIcon,
  LayoutDashboard,
  Plus,
  Settings,
  Star,
  User,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    label: "New project",
    href: "/admin/projects/new",
    Icon: Plus,
    description: "Add a new portfolio project",
  },
  {
    label: "Upload media",
    href: "/admin/media",
    Icon: ImageIcon,
    description: "Manage images and uploads",
  },
  {
    label: "Edit About",
    href: "/admin/about",
    Icon: User,
    description: "Update About text and tools",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    Icon: Settings,
    description: "Update public site settings",
  },
];

const SNAPSHOT = [
  {
    title: "Projects",
    value: "—",
    meta: "Drafts: —",
    hint: "Total projects in your portfolio",
    Icon: Folder,
  },
  {
    title: "Featured",
    value: "—",
    meta: "Shown on homepage",
    hint: "Projects highlighted on the landing page",
    Icon: Star,
  },
  {
    title: "Media",
    value: "—",
    meta: "Last upload: —",
    hint: "Total assets in your library",
    Icon: ImageIcon,
  },
  {
    title: "Last updated",
    value: "—",
    meta: "Across admin content",
    hint: "Most recent content change",
    Icon: Clock,
  },
];

const RECENT_ACTIVITY = [
  { title: "Updated About text", detail: "About", when: "—" },
  { title: "Edited a project", detail: "Projects", when: "—" },
  { title: "Uploaded a media item", detail: "Media", when: "—" },
  { title: "Changed settings", detail: "Settings", when: "—" },
  { title: "Signed in", detail: "Auth", when: "—" },
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
              <LayoutDashboard
                className="w-4 h-4 text-blue-700"
                aria-hidden="true"
              />
              <span className="text-base font-medium text-gray-800 Ovo">
                Dashboard
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-2">
              Admin overview
            </h2>
            <p className="text-gray-700 Ovo max-w-2xl text-base">
              Quick shortcuts and stats (static for now).
            </p>
          </div>

          <div className="w-full sm:w-auto flex flex-wrap gap-2">
            <Link
              href="/admin/projects/new"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-base text-center inline-flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              New project
            </Link>
            <Link
              href="/admin/media"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-200 bg-white text-gray-700 text-base font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-center inline-flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-5 h-5" aria-hidden="true" />
              Media
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SNAPSHOT.map((card) => {
            const Icon = card.Icon;
            return (
              <div
                key={card.title}
                className="rounded-3xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-base font-semibold text-gray-900 Ovo">
                    {card.title}
                  </p>
                  <span className="w-11 h-11 rounded-2xl border border-gray-200 bg-white/90 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-700" aria-hidden="true" />
                  </span>
                </div>

                <p className="text-3xl font-bold text-gray-900 Ovo mt-3">
                  {card.value}
                </p>
                <p className="text-sm text-gray-700 Ovo mt-1">{card.meta}</p>
                <p className="text-sm text-gray-600 Ovo mt-2">{card.hint}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 Ovo mb-1">
                Quick actions
              </h3>
              <p className="text-base text-gray-700 Ovo">
                Jump to the most common tasks.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.Icon;
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group rounded-3xl border border-gray-200 bg-white p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="w-11 h-11 shrink-0 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-800" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-base font-semibold text-gray-900 Ovo">
                              {action.label}
                            </p>
                            <p className="text-sm text-gray-600 Ovo mt-1">
                              {action.description}
                            </p>
                          </div>
                        </div>

                        <ArrowRight
                          className="w-5 h-5 text-gray-400 group-hover:text-blue-700 transition-colors"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 Ovo mb-1">
                    Recent activity
                  </h3>
                  <p className="text-base text-gray-700 Ovo">
                    Your most recent admin changes.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-gray-600 Ovo">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  Last 5
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {RECENT_ACTIVITY.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="rounded-2xl border border-gray-200 bg-white p-4 flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-gray-900 Ovo truncate">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 Ovo mt-1">
                        {item.detail}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 Ovo whitespace-nowrap">
                      {item.when}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className="w-5 h-5 text-blue-800"
                      aria-hidden="true"
                    />
                    <h3 className="text-xl font-bold text-gray-900 Ovo">
                      Needs attention
                    </h3>
                  </div>
                  <p className="text-base text-gray-700 Ovo mt-1">
                    Keep content complete before publishing.
                  </p>
                </div>
                <Link
                  href="/admin/projects"
                  className="text-base font-medium text-blue-700 hover:text-blue-800 Ovo"
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
                    <p className="text-base text-gray-800 Ovo">{row.title}</p>
                    <p className="text-base font-semibold text-gray-900 Ovo whitespace-nowrap">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-4">
                <p className="text-sm text-gray-700 Ovo">
                  Tip: once the DB is connected, this will show real counts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
