export const metadata = {
  title: "Admin Dashboard | Portfolio",
};

import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
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

import { sql } from "@/app/lib/db";
import { requireAdmin } from "@/app/lib/adminSession";

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

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatCount(value) {
  if (value == null) return "—";
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return number.toLocaleString();
}

function formatTimeAgo(value) {
  const date = toDate(value);
  if (!date) return "—";

  const diffMs = Date.now() - date.getTime();
  if (!Number.isFinite(diffMs)) return "—";

  const diffSeconds = Math.floor(diffMs / 1000);
  if (diffSeconds < 10) return "just now";
  if (diffSeconds < 60) return `${diffSeconds}s ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function maxDate(values) {
  const list = Array.isArray(values) ? values : [];
  let max = null;

  for (const value of list) {
    const date = toDate(value);
    if (!date) continue;
    if (!max || date.getTime() > max.getTime()) {
      max = date;
    }
  }

  return max;
}

async function getDashboardTableFlags() {
  const rows = await sql`
    SELECT
      to_regclass('public.admin_sessions') IS NOT NULL AS admin_sessions,
      to_regclass('public.projects') IS NOT NULL AS projects,
      to_regclass('public.media_assets') IS NOT NULL AS media_assets,
      to_regclass('public.about_content') IS NOT NULL AS about_content,
      to_regclass('public.about_cards') IS NOT NULL AS about_cards,
      to_regclass('public.services_content') IS NOT NULL AS services_content,
      to_regclass('public.services') IS NOT NULL AS services,
      to_regclass('public.site_settings') IS NOT NULL AS site_settings
  `;

  const row = rows?.[0] ?? {};

  return {
    admin_sessions: Boolean(row.admin_sessions),
    projects: Boolean(row.projects),
    media_assets: Boolean(row.media_assets),
    about_content: Boolean(row.about_content),
    about_cards: Boolean(row.about_cards),
    services_content: Boolean(row.services_content),
    services: Boolean(row.services),
    site_settings: Boolean(row.site_settings),
  };
}

async function loadDashboardViewModel() {
  const setupMessages = [];

  let tables;
  try {
    tables = await getDashboardTableFlags();
  } catch (error) {
    console.error("Failed to check dashboard tables", error);
    return {
      snapshot: [
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
      ],
      recentActivity: [],
      needsAttention: [
        { title: "Projects missing cover image", value: "—" },
        { title: "Projects missing live URL", value: "—" },
        { title: "Projects missing GitHub URL", value: "—" },
        { title: "Projects missing description", value: "—" },
      ],
      setupMessage:
        "Unable to connect to the database. Check DATABASE_URL and your Neon connection.",
    };
  }

  if (!tables.admin_sessions) {
    setupMessages.push(
      "Auth tables are missing. Apply app/lib/auth.sql to your database.",
    );
  }
  if (!tables.projects) {
    setupMessages.push(
      "Projects tables are missing. Apply app/lib/projects.sql to your database.",
    );
  }
  if (!tables.media_assets) {
    setupMessages.push(
      "Media library table is missing. Apply app/lib/media.sql to your database.",
    );
  }
  if (!tables.about_content) {
    setupMessages.push(
      "About tables are missing. Apply app/lib/about.sql to your database.",
    );
  }
  if (!tables.site_settings) {
    setupMessages.push(
      "Settings table is missing. Apply app/lib/settings.sql to your database.",
    );
  }
  if (!tables.services_content || !tables.services) {
    setupMessages.push(
      "Services tables are missing. Apply app/lib/services.sql to your database.",
    );
  }

  const [
    projectStatsRows,
    mediaStatsRows,
    aboutContentRows,
    aboutCardsRows,
    servicesContentRows,
    servicesRows,
    settingsRows,
    signInRows,
  ] = await Promise.all([
    tables.projects
      ? sql`
          SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE is_published = false) AS drafts,
            COUNT(*) FILTER (WHERE is_published = true AND is_featured = true) AS featured,
            COUNT(*) FILTER (WHERE NULLIF(BTRIM(hero_image_url), '') IS NULL) AS missing_cover,
            COUNT(*) FILTER (WHERE NULLIF(BTRIM(project_live_url), '') IS NULL) AS missing_live,
            COUNT(*) FILTER (WHERE NULLIF(BTRIM(project_github_url), '') IS NULL) AS missing_github,
            COUNT(*) FILTER (WHERE NULLIF(BTRIM(description), '') IS NULL) AS missing_description,
            MAX(updated_at) AS last_project_update_at
          FROM projects
        `
      : Promise.resolve([]),
    tables.media_assets
      ? sql`
          SELECT
            COUNT(*) AS total,
            MAX(created_at) AS last_upload_at
          FROM media_assets
        `
      : Promise.resolve([]),
    tables.about_content
      ? sql`
          SELECT MAX(updated_at) AS updated_at
          FROM about_content
        `
      : Promise.resolve([]),
    tables.about_cards
      ? sql`
          SELECT MAX(updated_at) AS updated_at
          FROM about_cards
        `
      : Promise.resolve([]),
    tables.services_content
      ? sql`
          SELECT MAX(updated_at) AS updated_at
          FROM services_content
        `
      : Promise.resolve([]),
    tables.services
      ? sql`
          SELECT MAX(updated_at) AS updated_at
          FROM services
        `
      : Promise.resolve([]),
    tables.site_settings
      ? sql`
          SELECT MAX(updated_at) AS updated_at
          FROM site_settings
        `
      : Promise.resolve([]),
    tables.admin_sessions
      ? sql`
          SELECT MAX(created_at) AS created_at
          FROM admin_sessions
        `
      : Promise.resolve([]),
  ]);

  const projectRow = projectStatsRows?.[0] ?? null;
  const mediaRow = mediaStatsRows?.[0] ?? null;

  const projectsTotal = projectRow ? Number(projectRow.total ?? 0) : null;
  const projectsDrafts = projectRow ? Number(projectRow.drafts ?? 0) : null;
  const featuredTotal = projectRow ? Number(projectRow.featured ?? 0) : null;

  const projectsMissingCover = projectRow
    ? Number(projectRow.missing_cover ?? 0)
    : null;
  const projectsMissingLive = projectRow
    ? Number(projectRow.missing_live ?? 0)
    : null;
  const projectsMissingGithub = projectRow
    ? Number(projectRow.missing_github ?? 0)
    : null;
  const projectsMissingDescription = projectRow
    ? Number(projectRow.missing_description ?? 0)
    : null;

  const lastProjectUpdateAt = projectRow?.last_project_update_at ?? null;

  const mediaTotal = mediaRow ? Number(mediaRow.total ?? 0) : null;
  const lastMediaUploadAt = mediaRow?.last_upload_at ?? null;

  const aboutUpdatedAt = maxDate([
    aboutContentRows?.[0]?.updated_at,
    aboutCardsRows?.[0]?.updated_at,
  ]);

  const servicesUpdatedAt = maxDate([
    servicesContentRows?.[0]?.updated_at,
    servicesRows?.[0]?.updated_at,
  ]);

  const settingsUpdatedAt = toDate(settingsRows?.[0]?.updated_at);
  const lastSignInAt = toDate(signInRows?.[0]?.created_at);

  const lastUpdatedAt = maxDate([
    lastProjectUpdateAt,
    lastMediaUploadAt,
    aboutUpdatedAt,
    servicesUpdatedAt,
    settingsUpdatedAt,
  ]);

  const snapshot = [
    {
      title: "Projects",
      value: formatCount(projectsTotal),
      meta: `Drafts: ${formatCount(projectsDrafts)}`,
      hint: "Total projects in your portfolio",
      Icon: Folder,
    },
    {
      title: "Featured",
      value: formatCount(featuredTotal),
      meta: "Shown on homepage",
      hint: "Projects highlighted on the landing page",
      Icon: Star,
    },
    {
      title: "Media",
      value: formatCount(mediaTotal),
      meta: `Last upload: ${formatTimeAgo(lastMediaUploadAt)}`,
      hint: "Total assets in your library",
      Icon: ImageIcon,
    },
    {
      title: "Last updated",
      value: formatTimeAgo(lastUpdatedAt),
      meta: "Across admin content",
      hint: "Most recent content change",
      Icon: Clock,
    },
  ];

  const needsAttention = [
    {
      title: "Projects missing cover image",
      value: formatCount(projectsMissingCover),
    },
    {
      title: "Projects missing live URL",
      value: formatCount(projectsMissingLive),
    },
    {
      title: "Projects missing GitHub URL",
      value: formatCount(projectsMissingGithub),
    },
    {
      title: "Projects missing description",
      value: formatCount(projectsMissingDescription),
    },
  ];

  const activityCandidates = [
    {
      title: "Edited a project",
      detail: "Projects",
      date: toDate(lastProjectUpdateAt),
    },
    {
      title: "Uploaded a media item",
      detail: "Media",
      date: toDate(lastMediaUploadAt),
    },
    {
      title: "Updated About content",
      detail: "About",
      date: toDate(aboutUpdatedAt),
    },
    {
      title: "Updated services",
      detail: "Services",
      date: toDate(servicesUpdatedAt),
    },
    {
      title: "Changed settings",
      detail: "Settings",
      date: toDate(settingsUpdatedAt),
    },
    {
      title: "Signed in",
      detail: "Auth",
      date: toDate(lastSignInAt),
    },
  ];

  const recentActivity = activityCandidates
    .filter((item) => item.date)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)
    .map((item) => ({
      title: item.title,
      detail: item.detail,
      when: formatTimeAgo(item.date),
    }));

  const setupMessage = setupMessages.length ? setupMessages.join(" ") : null;

  return { snapshot, recentActivity, needsAttention, setupMessage };
}

export default async function AdminDashboardPage() {
  await requireAdmin();

  let dashboard = {
    snapshot: [
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
    ],
    recentActivity: [],
    needsAttention: [
      { title: "Projects missing cover image", value: "—" },
      { title: "Projects missing live URL", value: "—" },
      { title: "Projects missing GitHub URL", value: "—" },
      { title: "Projects missing description", value: "—" },
    ],
    setupMessage: null,
  };

  try {
    dashboard = await loadDashboardViewModel();
  } catch (error) {
    unstable_rethrow(error);
    console.error("Failed to load admin dashboard", error);
    dashboard.setupMessage =
      "Unable to load dashboard stats. Please check your database connection.";
  }

  const snapshot = Array.isArray(dashboard.snapshot) ? dashboard.snapshot : [];
  const recentActivity = Array.isArray(dashboard.recentActivity)
    ? dashboard.recentActivity
    : [];
  const needsAttention = Array.isArray(dashboard.needsAttention)
    ? dashboard.needsAttention
    : [];
  const setupMessage =
    typeof dashboard.setupMessage === "string" && dashboard.setupMessage.trim()
      ? dashboard.setupMessage.trim()
      : null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-linear-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
              <LayoutDashboard
                className="w-4 h-4 text-blue-700"
                aria-hidden="true"
              />
              <span className="text-base font-medium text-gray-800 Ovo">
                Dashboard
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold Ovo bg-linear-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-2">
              Admin overview
            </h2>
            <p className="text-gray-700 Ovo max-w-2xl text-base">
              Quick shortcuts and live stats.
            </p>
          </div>

          <div className="w-full sm:w-auto flex flex-wrap gap-2">
            <Link
              href="/admin/projects/new"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-base text-center inline-flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              New project
            </Link>
            <Link
              href="/admin/media"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-200 bg-white text-gray-700 text-base font-medium hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-center inline-flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-5 h-5" aria-hidden="true" />
              Media
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {snapshot.map((card) => {
            const Icon = card.Icon;
            return (
              <div
                key={card.title}
                className="rounded-3xl border border-gray-200 bg-linear-to-r from-blue-50/60 to-purple-50/60 p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-base font-semibold text-gray-900 Ovo">
                    {card.title}
                  </p>
                  <span className="w-11 h-11 rounded-2xl border border-gray-200 bg-white/90 flex items-center justify-center">
                    <Icon
                      className="w-5 h-5 text-blue-700"
                      aria-hidden="true"
                    />
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
                      className="group rounded-3xl border border-gray-200 bg-white p-5 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="w-11 h-11 shrink-0 rounded-2xl border border-gray-200 bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <Icon
                              className="w-5 h-5 text-blue-800"
                              aria-hidden="true"
                            />
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
                {recentActivity.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-600 Ovo">
                      No activity yet.
                    </p>
                  </div>
                ) : (
                  recentActivity.map((item, index) => (
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
                  ))
                )}
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
                {needsAttention.map((row) => (
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

              <div className="mt-5 rounded-2xl border border-gray-200 bg-linear-to-r from-blue-50/60 to-purple-50/60 p-4">
                <p className="text-sm text-gray-700 Ovo">
                  {setupMessage || "Live stats are pulled from your database."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
