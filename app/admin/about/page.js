export const metadata = {
  title: "Admin About | Portfolio",
};

import { assets, infoList, toolsData } from "@/assets/assets";
import Image from "next/image";

const ABOUT_HEADING_DEFAULT = "About Me";
const ABOUT_BODY_DEFAULT =
  "I am an experienced Front-End Developer with a strong passion for creating visually appealing and user-friendly websites. I specialize in building responsive web applications that deliver seamless user experiences across various devices. I am proficient in modern frameworks such as React and Next.js.";

export default function AdminAboutPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
          <span className="text-xl">👤</span>
          <span className="text-sm font-medium text-gray-700 Ovo">About</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          About content
        </h2>
        <p className="text-gray-600 Ovo mb-8 max-w-2xl">
          Edit your About section and what shows under it (Languages, Education,
          Projects, and Tools I Use). Design-only for now.
        </p>

        <div className="grid grid-cols-1 gap-6">
          {/* About me */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 Ovo">
                  About me
                </h3>
                <p className="text-sm text-gray-600 Ovo mt-1">
                  This text shows on the homepage.
                </p>
              </div>
              <button
                type="button"
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
              >
                Preview section
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                  Heading
                </label>
                <input
                  type="text"
                  name="aboutHeading"
                  defaultValue={ABOUT_HEADING_DEFAULT}
                  className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
                  Body
                </label>
                <textarea
                  name="aboutBody"
                  rows={6}
                  defaultValue={ABOUT_BODY_DEFAULT}
                  className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
                />
              </div>
            </div>
          </div>

          {/* Pictures (Hero + About) */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 Ovo">
                  Pictures
                </h3>
                <p className="text-sm text-gray-600 Ovo mt-1">
                  Your site uses two images: Hero (top) and About (section).
                </p>
              </div>
              <button
                type="button"
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
              >
                Open media library
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 Ovo">
                      Hero image
                    </p>
                    <p className="text-xs text-gray-600 Ovo mt-1">
                      Used at the top header section.
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 Ovo px-3 py-1 rounded-full border border-gray-200 bg-white">
                    assets.profile_img
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 bg-white">
                    <Image
                      src={assets.profile_img}
                      alt="Hero profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                    >
                      Choose
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-red-600 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 Ovo">
                      About image
                    </p>
                    <p className="text-xs text-gray-600 Ovo mt-1">
                      Used inside the About section.
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 Ovo px-3 py-1 rounded-full border border-gray-200 bg-white">
                    assets.user_image
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 bg-white">
                    <Image
                      src={assets.user_image}
                      alt="About profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                    >
                      Choose
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-red-600 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 Ovo mt-4">
              Later: connect these to Cloudinary + the Media library.
            </p>
          </div>

          {/* About cards + Tools */}
          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 Ovo">
                    About cards
                  </h3>
                  <p className="text-sm text-gray-600 Ovo mt-1">
                    Languages, Education, Projects cards under About.
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                >
                  Reset
                </button>
              </div>

              <div className="mt-6 grid gap-5">
                {infoList.map((card, index) => (
                  <div key={`${card.title}-${index}`} className="grid gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl border border-gray-200 flex items-center justify-center">
                          <Image
                            src={card.icon}
                            alt={card.title}
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 Ovo">
                            Card {index + 1}
                          </p>
                          <p className="text-xs text-gray-600 Ovo mt-0.5">
                            {card.title}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                      >
                        Change icon
                      </button>
                    </div>

                    <div className="grid gap-3">
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

                    {index !== infoList.length - 1 ? (
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 Ovo">
                    Tools I Use
                  </h3>
                  <p className="text-sm text-gray-600 Ovo mt-1">
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
                {toolsData.map((tool, index) => (
                  <div key={`tool-${index}`} className="group relative">
                    <button
                      type="button"
                      className="relative w-14 h-14 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 overflow-hidden"
                      aria-label={`Tool ${index + 1}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Image
                        src={tool}
                        alt="Tool"
                        className="relative z-10 w-7 h-7 object-contain"
                      />
                    </button>

                    <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full flex gap-2">
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
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-4">
                <p className="text-xs text-gray-600 Ovo">
                  Tip: click an icon later to replace/remove (wiring coming).
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
