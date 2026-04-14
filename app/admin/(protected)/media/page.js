export const metadata = {
  title: "Admin Media | Portfolio",
};

import { Image as ImageIcon } from "lucide-react";

import {
  getMediaAssetsAdmin,
  syncMediaAssetsFromProjectsAdmin,
} from "@/app/actions/mediaActions";

import AdminMediaClient from "./AdminMediaClient";

export default async function AdminMediaPage() {
  // NOTE: both actions enforce `requireAdmin()`.
  await syncMediaAssetsFromProjectsAdmin();
  const { assets, message } = await getMediaAssetsAdmin({ limit: 200 });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
          <ImageIcon className="w-4 h-4 text-blue-700" aria-hidden="true" />
          <span className="text-base font-medium text-gray-800 Ovo">Media</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          Media library
        </h2>
        <p className="text-gray-600 Ovo mb-8 max-w-2xl">
          Upload and manage images and videos.
        </p>

        <AdminMediaClient initialAssets={assets} setupMessage={message} />
      </div>
    </div>
  );
}
