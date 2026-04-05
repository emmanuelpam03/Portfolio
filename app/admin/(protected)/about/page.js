  import { assets, infoList, toolsData } from "@/assets/assets";
import Image from "next/image";

export const metadata = {
  title: "Admin About | Portfolio",
};

export default function AdminAboutPage() {
  const toolLabelFromSrc = (tool, fallback) => {
    const rawSrc =
      typeof tool === "string"
        ? tool
        : typeof tool?.src === "string"
          ? tool.src
          : "";

    if (!rawSrc) return fallback;

    const filename = rawSrc.split("/").pop() || "";
    const base = filename.replace(/\.[a-z0-9]+$/i, "");
    const normalized = base
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    const overrides = {
      mongodb: "MongoDB",
      vscode: "VS Code",
      figma: "Figma",
      firebase: "Firebase",
      git: "Git",
    };

    if (overrides[normalized]) return overrides[normalized];
    return normalized
      ? normalized.replace(/\b\w/g, (c) => c.toUpperCase())
      : fallback;
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: text + cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
                About text
              </h3>
              <p className="text-sm text-gray-600 Ovo mb-5">
                This paragraph appears in the About section.
              </p>

              <div>
                <label className="block text-xs font-medium text-gray-700 Ovo mb-1">
                  Description
                </label>
                <textarea
                  rows={6}
                  name="aboutText"
                  defaultValue={
                    "I am an experienced Front-End Developer with a strong passion for creating visually appealing and user-friendly websites. I specialize in building responsive web applications that deliver seamless user experiences across various devices. I am proficient in modern frameworks such as React and Next.js."
                  }
                  className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                />
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
                    About cards
                  </h3>
                  <p className="text-sm text-gray-600 Ovo">
                    The three cards under About (Languages, Education,
                    Projects).
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                >
                  Add (coming soon)
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                {infoList.map((card, index) => (
                  <div
                    key={`info-${index}`}
                    className="rounded-3xl border border-gray-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl border border-gray-200 flex items-center justify-center">
                          <Image
                            src={card.icon}
                            alt=""
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 Ovo">
                            Card {index + 1}
                          </p>
                          <p className="text-xs text-gray-600 Ovo">
                            Icon is based on your public site assets.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium"
                      >
                        Remove (coming soon)
                      </button>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 Ovo mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          name={`infoList.${index}.title`}
                          defaultValue={card.title}
                          className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 Ovo mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          name={`infoList.${index}.description`}
                          defaultValue={card.description}
                          className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: images + tools */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
                Pictures
              </h3>
              <p className="text-sm text-gray-600 Ovo mb-5">
                Your site uses two different images.
              </p>

              <div className="grid gap-4">
                <div className="rounded-3xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-5">
                  <p className="text-sm font-semibold text-gray-900 Ovo">
                    Hero image
                  </p>
                  <p className="text-xs text-gray-600 Ovo mt-1">
                    Used on the Header section.
                  </p>
                  <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-3 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-blue-100 to-purple-100">
                      <Image
                        src={assets.profile_img}
                        alt="Hero image preview"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600 Ovo">Current</p>
                      <p className="text-sm font-medium text-gray-900 Ovo truncate">
                        assets.profile_img
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium"
                    >
                      Replace (coming soon)
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-5">
                  <p className="text-sm font-semibold text-gray-900 Ovo">
                    About section image
                  </p>
                  <p className="text-xs text-gray-600 Ovo mt-1">
                    Used inside the About section.
                  </p>
                  <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-3 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-blue-100 to-purple-100">
                      <Image
                        src={assets.user_image}
                        alt="About image preview"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600 Ovo">Current</p>
                      <p className="text-sm font-medium text-gray-900 Ovo truncate">
                        assets.user_image
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium"
                    >
                      Replace (coming soon)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 Ovo mb-1">
                    Tools I Use
                  </h3>
                  <p className="text-sm text-gray-600 Ovo">
                    Icons shown under About.
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                >
                  Add
                </button>
              </div>

              <div className="mt-6 flex items-center justify-start flex-wrap gap-3">
                {toolsData.map((tool, index) => {
                  const toolName = toolLabelFromSrc(tool, `Tool ${index + 1}`);
                  return (
                    <div key={`tool-${index}`} className="group relative">
                      <button
                        type="button"
                        className="relative w-14 h-14 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 overflow-hidden"
                        aria-label={`${toolName} (edit)`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Image
                          src={tool}
                          alt={`${toolName} logo`}
                          width={28}
                          height={28}
                          className="relative z-10 w-7 h-7 object-contain"
                        />
                      </button>

                      <div className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-200 absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full flex gap-2">
                        <button
                          type="button"
                          className="pointer-events-auto px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="pointer-events-auto px-3 py-1.5 rounded-full border border-gray-200 bg-white text-red-600 text-xs font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-4">
                <p className="text-xs text-gray-600 Ovo">
                  Tip: use Tab to reach the Edit/Remove buttons.
                </p>
              </div>
            </div>
          </div>
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
