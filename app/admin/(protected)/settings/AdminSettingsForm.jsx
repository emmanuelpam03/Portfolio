"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

import { updateSettingsAction } from "@/app/actions/settingsActions";

const initialState = {
  ok: false,
  message: null,
  errors: {},
  fields: {},
};

function toErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  return "Upload failed.";
}

function truncateMiddle(value, maxLength = 44) {
  if (!value || typeof value !== "string") return "";
  if (value.length <= maxLength) return value;
  const keep = Math.max(10, Math.floor((maxLength - 3) / 2));
  return `${value.slice(0, keep)}...${value.slice(-keep)}`;
}

function normalizeInitialTags(initialSettings) {
  if (!initialSettings) {
    return ["React", "Next.js", "TypeScript", "Tailwind"];
  }

  const tags = Array.isArray(initialSettings?.tech_tags)
    ? initialSettings.tech_tags
    : [];

  const normalized = tags
    .map((tag) => String(tag ?? "").trim())
    .filter(Boolean)
    .slice(0, 16);

  return normalized;
}

function normalizeInitialCvUrl(initialSettings) {
  if (!initialSettings) {
    return "/sample-resume.pdf";
  }

  const value = String(initialSettings?.cv_url ?? "").trim();
  return value.length ? value : "";
}

async function getCloudinarySignature({ folder } = {}) {
  const body = folder ? JSON.stringify({ folder }) : null;

  const response = await fetch("/api/cloudinary/signature", {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body,
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof json?.error === "string" && json.error.length
        ? json.error
        : "Unable to sign upload.";
    throw new Error(message);
  }

  return json;
}

async function uploadToCloudinary({ file, resourceType, folder }) {
  const {
    cloudName,
    apiKey,
    timestamp,
    folder: signedFolder,
    signature,
  } = await getCloudinarySignature({ folder });

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", String(apiKey));
  body.append("timestamp", String(timestamp));
  body.append("signature", String(signature));
  if (signedFolder) body.append("folder", String(signedFolder));

  const response = await fetch(endpoint, { method: "POST", body });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof json?.error?.message === "string" && json.error.message.length
        ? json.error.message
        : "Upload failed.";
    throw new Error(message);
  }

  const secureUrl = String(json?.secure_url ?? "").trim();
  if (!secureUrl) {
    throw new Error("Upload failed.");
  }

  return { secureUrl };
}

export default function AdminSettingsForm({ initialSettings, setupMessage }) {
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    initialState,
  );

  const [techTags, setTechTags] = useState(() =>
    normalizeInitialTags(initialSettings),
  );
  const [newTag, setNewTag] = useState("");

  const [cvUrl, setCvUrl] = useState(() =>
    normalizeInitialCvUrl(initialSettings),
  );
  const fileInputRef = useRef(null);

  const [cvUpload, setCvUpload] = useState({
    status: "idle", // idle | uploading | error | success
    message: "",
  });

  const readyForDbWrites = !setupMessage;
  const errors = state?.errors ?? {};

  const techTagsJson = useMemo(() => JSON.stringify(techTags), [techTags]);

  const isUploadingCv = cvUpload.status === "uploading";
  const isBusy = isPending || isUploadingCv;

  function addTag() {
    const value = String(newTag ?? "").trim();
    if (!value) return;

    const key = value.toLowerCase();
    const existing = techTags.some((tag) => String(tag).toLowerCase() === key);
    if (existing) {
      setNewTag("");
      return;
    }

    setTechTags((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      if (next.length >= 16) return next;
      next.push(value);
      return next;
    });

    setNewTag("");
  }

  function removeTag(tagToRemove) {
    const key = String(tagToRemove ?? "").toLowerCase();
    setTechTags((prev) =>
      (Array.isArray(prev) ? prev : []).filter(
        (tag) => String(tag).toLowerCase() !== key,
      ),
    );
  }

  function viewCv() {
    const href = String(cvUrl ?? "").trim();
    if (!href) return;
    window.open(href, "_blank", "noopener,noreferrer");
  }

  function removeCv() {
    setCvUrl("");
    setCvUpload({ status: "idle", message: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onCvFileChange(event) {
    const file = event.target?.files?.[0] ?? null;
    if (event.target) event.target.value = "";
    if (!file) return;

    setCvUpload({ status: "uploading", message: "Uploading CV..." });

    try {
      const { secureUrl } = await uploadToCloudinary({
        file,
        resourceType: "raw",
        folder: "portfolio/media",
      });

      setCvUrl(secureUrl);
      setCvUpload({
        status: "success",
        message: "CV uploaded. Click Save to publish it.",
      });
    } catch (error) {
      setCvUpload({ status: "error", message: toErrorMessage(error) });
    }
  }

  const displayNameFallback = "Emmanuel Pam";
  const locationFallback = "Based in Mauritius";
  const emailFallback = "emmanuelpam03@gmail.com";
  const headlineFallback = "Full-Stack Developer";
  const bioFallback =
    "I design, build, and ship full-stack products: responsive UI, secure backends, and scalable data — with React/Next.js.";
  const githubFallback = "https://github.com/emmanuelpam03";

  const hasInitialSettings = Boolean(
    initialSettings && typeof initialSettings === "object",
  );

  const displayNameDefault =
    initialSettings?.display_name ??
    state?.fields?.display_name ??
    displayNameFallback;
  const locationDefault =
    initialSettings?.location ?? state?.fields?.location ?? locationFallback;
  const emailDefault =
    initialSettings?.public_email ??
    state?.fields?.public_email ??
    emailFallback;
  const headlineDefault =
    initialSettings?.hero_headline ??
    state?.fields?.hero_headline ??
    headlineFallback;
  const bioDefault =
    initialSettings?.hero_bio ?? state?.fields?.hero_bio ?? bioFallback;

  const githubDefault = hasInitialSettings
    ? typeof initialSettings?.github_url === "string"
      ? initialSettings.github_url
      : ""
    : githubFallback;

  const linkedinDefault = hasInitialSettings
    ? typeof initialSettings?.linkedin_url === "string"
      ? initialSettings.linkedin_url
      : ""
    : "";

  const hasCv = Boolean(String(cvUrl ?? "").trim());

  return (
    <form action={formAction} className="grid grid-cols-1 gap-5" noValidate>
      {(setupMessage || state?.message) && (
        <div className="mb-1 rounded-2xl border border-gray-200 bg-linear-to-r from-blue-50/60 to-purple-50/60 p-4">
          {setupMessage && (
            <p className="text-sm text-gray-700 Ovo">{setupMessage}</p>
          )}
          {state?.message && (
            <p className="text-sm text-gray-700 Ovo">{state.message}</p>
          )}
        </div>
      )}

      <input type="hidden" name="tech_tags_json" value={techTagsJson} />
      <input type="hidden" name="cv_url" value={cvUrl} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-5">
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">CV</h3>
          <p className="text-base text-gray-700 Ovo mb-5">
            Upload/replace your resume file.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-5">
              <p className="text-base font-medium text-gray-800 Ovo">
                Current file
              </p>
              <p className="text-sm text-gray-600 Ovo mt-1">
                {hasCv ? truncateMiddle(cvUrl) : "No file connected yet."}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={viewCv}
                  disabled={!hasCv}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={removeCv}
                  disabled={!hasCv || isBusy}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-red-600 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <label
                htmlFor="cv-upload"
                className="block text-sm font-medium text-gray-700 Ovo mb-2"
              >
                Upload new CV
              </label>
              <input
                ref={fileInputRef}
                type="file"
                name="cv"
                id="cv-upload"
                accept=".pdf,.doc,.docx"
                onChange={onCvFileChange}
                disabled={!readyForDbWrites || isBusy}
                className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
              />
              <p className="text-sm text-gray-600 Ovo mt-2">
                Recommended: PDF.
              </p>
              {cvUpload.message ? (
                <p
                  className={`mt-2 text-sm Ovo ${
                    cvUpload.status === "error"
                      ? "text-red-600"
                      : cvUpload.status === "success"
                        ? "text-green-700"
                        : "text-gray-700"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {cvUpload.message}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Tech tags</h3>
          <p className="text-base text-gray-700 Ovo mb-5">
            Edit the pill tags shown on the homepage.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {techTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 text-sm text-gray-800"
              >
                <span className="Ovo">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  disabled={isBusy}
                  className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>

          {Array.isArray(errors?.tech_tags) && errors.tech_tags.length > 0 && (
            <p className="-mt-2 mb-3 text-sm text-red-600 Ovo">
              {errors.tech_tags[0]}
            </p>
          )}

          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              name="newTag"
              placeholder="Add a tag (e.g. PostgreSQL)"
              aria-label="New tag name"
              disabled={!readyForDbWrites || isBusy}
              className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={!readyForDbWrites || isBusy}
              className="w-full px-5 py-3 rounded-full border border-gray-200 bg-white text-gray-700 text-base font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add tag
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
            Display name
          </label>
          <input
            type="text"
            name="display_name"
            defaultValue={displayNameDefault}
            aria-invalid={Boolean(errors?.display_name?.length)}
            disabled={!readyForDbWrites || isBusy}
            className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
              errors?.display_name?.length
                ? "border-red-300"
                : "border-gray-300"
            }`}
          />
          {Array.isArray(errors?.display_name) && errors.display_name[0] ? (
            <p className="mt-2 text-sm text-red-600 Ovo">
              {errors.display_name[0]}
            </p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            defaultValue={locationDefault}
            aria-invalid={Boolean(errors?.location?.length)}
            disabled={!readyForDbWrites || isBusy}
            className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
              errors?.location?.length ? "border-red-300" : "border-gray-300"
            }`}
          />
          {Array.isArray(errors?.location) && errors.location[0] ? (
            <p className="mt-2 text-sm text-red-600 Ovo">
              {errors.location[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
          Public email
        </label>
        <input
          type="email"
          name="public_email"
          defaultValue={emailDefault}
          aria-invalid={Boolean(errors?.public_email?.length)}
          disabled={!readyForDbWrites || isBusy}
          className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
            errors?.public_email?.length ? "border-red-300" : "border-gray-300"
          }`}
        />
        <p className="text-xs text-gray-500 Ovo mt-2">
          This is the email displayed on your homepage/footer.
        </p>
        {Array.isArray(errors?.public_email) && errors.public_email[0] ? (
          <p className="mt-2 text-sm text-red-600 Ovo">
            {errors.public_email[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
          Hero headline
        </label>
        <input
          type="text"
          name="hero_headline"
          defaultValue={headlineDefault}
          aria-invalid={Boolean(errors?.hero_headline?.length)}
          disabled={!readyForDbWrites || isBusy}
          className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
            errors?.hero_headline?.length ? "border-red-300" : "border-gray-300"
          }`}
        />
        {Array.isArray(errors?.hero_headline) && errors.hero_headline[0] ? (
          <p className="mt-2 text-sm text-red-600 Ovo">
            {errors.hero_headline[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
          Short bio
        </label>
        <textarea
          name="hero_bio"
          rows={4}
          defaultValue={bioDefault}
          aria-invalid={Boolean(errors?.hero_bio?.length)}
          disabled={!readyForDbWrites || isBusy}
          className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
            errors?.hero_bio?.length ? "border-red-300" : "border-gray-300"
          }`}
        />
        {Array.isArray(errors?.hero_bio) && errors.hero_bio[0] ? (
          <p className="mt-2 text-sm text-red-600 Ovo">{errors.hero_bio[0]}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            name="github_url"
            defaultValue={githubDefault}
            aria-invalid={Boolean(errors?.github_url?.length)}
            disabled={!readyForDbWrites || isBusy}
            className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
              errors?.github_url?.length ? "border-red-300" : "border-gray-300"
            }`}
          />
          {Array.isArray(errors?.github_url) && errors.github_url[0] ? (
            <p className="mt-2 text-sm text-red-600 Ovo">
              {errors.github_url[0]}
            </p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
            LinkedIn URL
          </label>
          <input
            type="url"
            name="linkedin_url"
            defaultValue={linkedinDefault}
            aria-invalid={Boolean(errors?.linkedin_url?.length)}
            disabled={!readyForDbWrites || isBusy}
            className={`w-full p-3 outline-none border-[0.5px] rounded-md bg-white ${
              errors?.linkedin_url?.length
                ? "border-red-300"
                : "border-gray-300"
            }`}
          />
          {Array.isArray(errors?.linkedin_url) && errors.linkedin_url[0] ? (
            <p className="mt-2 text-sm text-red-600 Ovo">
              {errors.linkedin_url[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3">
        <button
          type="submit"
          disabled={!readyForDbWrites || isBusy}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBusy ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
