"use client";

import { logoutAdmin } from "@/app/actions/adminAuth";

export default function AdminLogoutButton({ fullWidth = false, className = "" }) {
  return (
    <form action={logoutAdmin} className={fullWidth ? "w-full" : undefined}>
      <button
        type="submit"
        className={`${fullWidth ? "w-full " : ""}px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-base font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 ${className}`}
      >
        Logout
      </button>
    </form>
  );
}
