export const metadata = {
  title: "Admin Login | Portfolio",
};

import { requestAdminMagicLink } from "@/app/actions/adminAuth";
import AdminLoginForm from "@/app/admin/login/AdminLoginForm";
import ToastOnMount from "@/app/components/ToastOnMount";
import { Lock } from "lucide-react";

export default function AdminLoginPage({ searchParams }) {
  const loggedOut = String(searchParams?.logged_out ?? "") === "1";
  const toastMessage = loggedOut ? "Logged out." : null;

  return (
    <div className="max-w-xl mx-auto">
      {toastMessage ? (
        <ToastOnMount variant="success" message={toastMessage} />
      ) : null}

      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-5">
          <Lock className="w-4 h-4 text-blue-700" aria-hidden="true" />
          <span className="text-base font-medium text-gray-800 Ovo">Admin</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          Sign in
        </h2>
        <p className="text-gray-600 Ovo mb-6">
          Enter your admin email to receive a one-time sign-in link.
        </p>

        <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-4 mb-6">
          <p className="text-sm text-gray-700 Ovo">
            You’ll only be able to sign in if your email is allowlisted.
          </p>
        </div>

        <AdminLoginForm action={requestAdminMagicLink} />
      </div>
    </div>
  );
}
