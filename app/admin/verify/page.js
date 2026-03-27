import Link from "next/link";

export const metadata = {
  title: "Verifying… | Admin",
};

export default async function AdminVerifyPage({ searchParams }) {
  const error = (await searchParams)?.error;

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold Ovo bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
          {error ? "Link invalid" : "Verifying…"}
        </h2>
        <p className="text-gray-600 Ovo mb-6">
          {error
            ? String(error)
            : "If nothing happens in a second, open your sign-in link again."}
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center w-full px-6 py-3 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
