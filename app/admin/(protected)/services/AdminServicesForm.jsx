"use client";

import { useActionState, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";

import { updateServicesAction } from "@/app/actions/servicesActions";

const initialState = {
  ok: false,
  message: null,
  errors: {},
  fields: {},
};

const FALLBACK_CONTENT = {
  is_enabled: true,
  kicker_text: "What I Offer",
  heading_text: "My Services",
  intro_text:
    "I build fast, scalable front-end experiences using React and Next.js, focused on performance and clean UI.",
  show_cta: true,
  cta_title: "Have a project in mind?",
  cta_body: "Let's work together to bring your ideas to life",
  cta_button_text: "Get in Touch",
  cta_button_href: "#contact",
};

const FALLBACK_SERVICES = [
  {
    title: "Web design",
    description: "Web development is the process of building, programming...",
    icon_key: "globe",
    link_url: "",
    is_active: true,
  },
  {
    title: "Mobile app",
    description:
      "Mobile app development involves creating software for mobile devices...",
    icon_key: "smartphone",
    link_url: "",
    is_active: true,
  },
  {
    title: "UI/UX design",
    description:
      "UI/UX design focuses on creating a seamless user experience...",
    icon_key: "layout",
    link_url: "",
    is_active: true,
  },
  {
    title: "Graphics design",
    description: "Creative design solutions to enhance visual communication...",
    icon_key: "brush",
    link_url: "",
    is_active: true,
  },
];

const ICON_OPTIONS = [
  { value: "globe", label: "Globe" },
  { value: "smartphone", label: "Smartphone" },
  { value: "layout", label: "Layout" },
  { value: "brush", label: "Brush" },
];

function pickText(value, fallback) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : fallback;
}

function normalizeInitialContent(content) {
  const row = content && typeof content === "object" ? content : null;

  return {
    is_enabled: row ? Boolean(row.is_enabled) : FALLBACK_CONTENT.is_enabled,
    kicker_text: row
      ? pickText(row.kicker_text, FALLBACK_CONTENT.kicker_text)
      : FALLBACK_CONTENT.kicker_text,
    heading_text: row
      ? pickText(row.heading_text, FALLBACK_CONTENT.heading_text)
      : FALLBACK_CONTENT.heading_text,
    intro_text: row
      ? pickText(row.intro_text, FALLBACK_CONTENT.intro_text)
      : FALLBACK_CONTENT.intro_text,

    show_cta: row ? Boolean(row.show_cta) : FALLBACK_CONTENT.show_cta,
    cta_title: row
      ? pickText(row.cta_title, FALLBACK_CONTENT.cta_title)
      : FALLBACK_CONTENT.cta_title,
    cta_body: row
      ? pickText(row.cta_body, FALLBACK_CONTENT.cta_body)
      : FALLBACK_CONTENT.cta_body,
    cta_button_text: row
      ? pickText(row.cta_button_text, FALLBACK_CONTENT.cta_button_text)
      : FALLBACK_CONTENT.cta_button_text,
    cta_button_href: row
      ? pickText(row.cta_button_href, FALLBACK_CONTENT.cta_button_href)
      : FALLBACK_CONTENT.cta_button_href,
  };
}

function normalizeInitialServices(services, { allowFallback } = {}) {
  const list = Array.isArray(services) ? services : [];

  const normalized = list
    .map((row) => ({
      title: typeof row?.title === "string" ? row.title : "",
      description: typeof row?.description === "string" ? row.description : "",
      icon_key: typeof row?.icon_key === "string" ? row.icon_key : "globe",
      link_url: typeof row?.link_url === "string" ? row.link_url : "",
      is_active: Boolean(row?.is_active ?? true),
      sort_order: Number(row?.sort_order ?? 0),
    }))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(({ sort_order: _ignore, ...rest }) => rest);

  if (normalized.length) return normalized;

  return allowFallback ? [...FALLBACK_SERVICES] : [];
}

function moveItem(list, fromIndex, toIndex) {
  if (!Array.isArray(list)) return list;
  if (fromIndex === toIndex) return list;
  if (fromIndex < 0 || fromIndex >= list.length) return list;
  if (toIndex < 0 || toIndex >= list.length) return list;

  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export default function AdminServicesForm({
  initialContent,
  initialServices,
  setupMessage,
}) {
  const [state, formAction, isPending] = useActionState(
    updateServicesAction,
    initialState,
  );

  const readyForDbWrites = !setupMessage;
  const errors = state?.errors ?? {};

  const contentDefaults = useMemo(
    () => normalizeInitialContent(initialContent),
    [initialContent],
  );

  const [services, setServices] = useState(() =>
    normalizeInitialServices(initialServices, { allowFallback: !readyForDbWrites }),
  );

  const servicesJson = JSON.stringify(
    services.map((service) => ({
      title: service.title,
      description: service.description,
      icon_key: service.icon_key,
      link_url: service.link_url ? service.link_url : null,
      is_active: Boolean(service.is_active),
    })),
  );

  function addService() {
    setServices((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      {
        title: "",
        description: "",
        icon_key: "globe",
        link_url: "",
        is_active: true,
      },
    ]);
  }

  function updateService(index, patch) {
    setServices((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      if (index < 0 || index >= current.length) return current;
      const next = [...current];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  function removeService(index) {
    setServices((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      return current.filter((_item, i) => i !== index);
    });
  }

  return (
    <form action={formAction} className="mt-6 space-y-6" noValidate>
      {(setupMessage || state?.message) && (
        <div className="rounded-2xl border border-gray-200 bg-linear-to-r from-blue-50/60 to-purple-50/60 p-4">
          {setupMessage && (
            <p className="text-sm text-gray-700 Ovo">{setupMessage}</p>
          )}
          {state?.message && (
            <p className="text-sm text-gray-700 Ovo">{state.message}</p>
          )}
        </div>
      )}

      <input type="hidden" name="services_json" value={servicesJson} />

      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
              Section content
            </h3>
            <p className="text-base text-gray-700 Ovo">
              Edit the Services header and description.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 Ovo">
            <input
              type="checkbox"
              name="is_enabled"
              defaultChecked={contentDefaults.is_enabled}
              disabled={!readyForDbWrites || isPending}
              className="h-4 w-4"
            />
            Enabled
          </label>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              Kicker text
            </label>
            <input
              type="text"
              name="kicker_text"
              defaultValue={contentDefaults.kicker_text}
              aria-invalid={Boolean(errors?.kicker_text?.length)}
              disabled={!readyForDbWrites || isPending}
              className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
                errors?.kicker_text?.length ? "border-red-300" : "border-gray-300"
              }`}
            />
            {Array.isArray(errors?.kicker_text) && errors.kicker_text[0] ? (
              <p className="mt-2 text-sm text-red-600 Ovo">{errors.kicker_text[0]}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              Heading
            </label>
            <input
              type="text"
              name="heading_text"
              defaultValue={contentDefaults.heading_text}
              aria-invalid={Boolean(errors?.heading_text?.length)}
              disabled={!readyForDbWrites || isPending}
              className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
                errors?.heading_text?.length ? "border-red-300" : "border-gray-300"
              }`}
            />
            {Array.isArray(errors?.heading_text) && errors.heading_text[0] ? (
              <p className="mt-2 text-sm text-red-600 Ovo">{errors.heading_text[0]}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
            Intro paragraph
          </label>
          <textarea
            name="intro_text"
            rows={4}
            defaultValue={contentDefaults.intro_text}
            aria-invalid={Boolean(errors?.intro_text?.length)}
            disabled={!readyForDbWrites || isPending}
            className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
              errors?.intro_text?.length ? "border-red-300" : "border-gray-300"
            }`}
          />
          {Array.isArray(errors?.intro_text) && errors.intro_text[0] ? (
            <p className="mt-2 text-sm text-red-600 Ovo">{errors.intro_text[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">CTA</h3>
            <p className="text-base text-gray-700 Ovo">
              The call-to-action box shown under the services grid.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 Ovo">
            <input
              type="checkbox"
              name="show_cta"
              defaultChecked={contentDefaults.show_cta}
              disabled={!readyForDbWrites || isPending}
              className="h-4 w-4"
            />
            Show CTA
          </label>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              CTA title
            </label>
            <input
              type="text"
              name="cta_title"
              defaultValue={contentDefaults.cta_title}
              aria-invalid={Boolean(errors?.cta_title?.length)}
              disabled={!readyForDbWrites || isPending}
              className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
                errors?.cta_title?.length ? "border-red-300" : "border-gray-300"
              }`}
            />
            {Array.isArray(errors?.cta_title) && errors.cta_title[0] ? (
              <p className="mt-2 text-sm text-red-600 Ovo">{errors.cta_title[0]}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
              Button text
            </label>
            <input
              type="text"
              name="cta_button_text"
              defaultValue={contentDefaults.cta_button_text}
              aria-invalid={Boolean(errors?.cta_button_text?.length)}
              disabled={!readyForDbWrites || isPending}
              className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
                errors?.cta_button_text?.length
                  ? "border-red-300"
                  : "border-gray-300"
              }`}
            />
            {Array.isArray(errors?.cta_button_text) &&
            errors.cta_button_text[0] ? (
              <p className="mt-2 text-sm text-red-600 Ovo">
                {errors.cta_button_text[0]}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
            CTA body
          </label>
          <textarea
            name="cta_body"
            rows={3}
            defaultValue={contentDefaults.cta_body}
            aria-invalid={Boolean(errors?.cta_body?.length)}
            disabled={!readyForDbWrites || isPending}
            className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
              errors?.cta_body?.length ? "border-red-300" : "border-gray-300"
            }`}
          />
          {Array.isArray(errors?.cta_body) && errors.cta_body[0] ? (
            <p className="mt-2 text-sm text-red-600 Ovo">{errors.cta_body[0]}</p>
          ) : null}
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
            Button link
          </label>
          <input
            type="text"
            name="cta_button_href"
            defaultValue={contentDefaults.cta_button_href}
            aria-invalid={Boolean(errors?.cta_button_href?.length)}
            disabled={!readyForDbWrites || isPending}
            className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
              errors?.cta_button_href?.length ? "border-red-300" : "border-gray-300"
            }`}
          />
          <p className="mt-2 text-xs text-gray-500 Ovo">
            Use an anchor like <span className="font-semibold">#contact</span>,
            a path like <span className="font-semibold">/projects</span>, or a
            full https:// URL.
          </p>
          {Array.isArray(errors?.cta_button_href) && errors.cta_button_href[0] ? (
            <p className="mt-2 text-sm text-red-600 Ovo">{errors.cta_button_href[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
              Services list
            </h3>
            <p className="text-base text-gray-700 Ovo">
              Add, edit, reorder, and hide items.
            </p>
          </div>

          <button
            type="button"
            onClick={addService}
            disabled={!readyForDbWrites || isPending}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-base font-medium hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 disabled:opacity-60"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add service
          </button>
        </div>

        {Array.isArray(errors?.services) && errors.services[0] ? (
          <p className="mt-4 text-sm text-red-600 Ovo">{errors.services[0]}</p>
        ) : null}

        <div className="mt-6 space-y-4">
          {services.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-600 Ovo">
                No services yet. Click “Add service” to create one.
              </p>
            </div>
          ) : (
            services.map((service, index) => {
              const iconOptions = ICON_OPTIONS;

              return (
                <div
                  key={`service-${index}`}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-2xl border border-gray-200 bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <GripVertical className="w-5 h-5 text-gray-600" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-600 Ovo">Item {index + 1}</p>
                        <p className="text-base font-semibold text-gray-900 Ovo truncate">
                          {service.title?.trim() ? service.title : "(untitled)"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() =>
                          setServices((prev) => moveItem(prev, index, index - 1))
                        }
                        disabled={
                          index === 0 || !readyForDbWrites || isPending
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-60"
                      >
                        <ArrowUp className="w-4 h-4" aria-hidden="true" />
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setServices((prev) => moveItem(prev, index, index + 1))
                        }
                        disabled={
                          index === services.length - 1 ||
                          !readyForDbWrites ||
                          isPending
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium disabled:opacity-60"
                      >
                        <ArrowDown className="w-4 h-4" aria-hidden="true" />
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        disabled={!readyForDbWrites || isPending}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-red-600 text-sm font-medium disabled:opacity-60"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) =>
                          updateService(index, { title: e.target.value })
                        }
                        disabled={!readyForDbWrites || isPending}
                        className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                        Icon
                      </label>
                      <select
                        value={service.icon_key}
                        onChange={(e) =>
                          updateService(index, { icon_key: e.target.value })
                        }
                        disabled={!readyForDbWrites || isPending}
                        className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                      >
                        {iconOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={service.description}
                        onChange={(e) =>
                          updateService(index, { description: e.target.value })
                        }
                        disabled={!readyForDbWrites || isPending}
                        className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                        Optional link
                      </label>
                      <input
                        type="text"
                        value={service.link_url ?? ""}
                        onChange={(e) =>
                          updateService(index, { link_url: e.target.value })
                        }
                        disabled={!readyForDbWrites || isPending}
                        className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                        placeholder="#contact or /projects or https://..."
                      />
                      <p className="mt-2 text-xs text-gray-500 Ovo">
                        If provided, the public card shows a “Learn more” link.
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 Ovo">
                        <input
                          type="checkbox"
                          checked={Boolean(service.is_active)}
                          onChange={(e) =>
                            updateService(index, { is_active: e.target.checked })
                          }
                          disabled={!readyForDbWrites || isPending}
                          className="h-4 w-4"
                        />
                        Visible on public site
                      </label>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!readyForDbWrites || isPending}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-base disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
