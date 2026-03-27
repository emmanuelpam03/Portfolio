"use client";

import { logoutAdmin } from "@/app/actions/adminAuth";

export default function AdminLogoutButton() {
  return (
    <form action={logoutAdmin}>
      <button
        type="submit"
        className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
      >
        Logout
      </button>
    </form>
  );
}
