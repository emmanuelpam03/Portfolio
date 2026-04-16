"use client";

import { useActionState, useEffect } from "react";

import { useToast } from "@/app/components/ToastProvider";

const initialState = { ok: false, message: null, fields: { email: "" } };

export default function AdminLoginForm({ action }) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const { success: toastSuccess, error: toastError } = useToast();

  useEffect(() => {
    const message =
      typeof state?.message === "string" ? state.message.trim() : "";
    if (!message) return;

    if (state?.ok) {
      toastSuccess(message);
    } else {
      toastError(message);
    }
  }, [state, toastSuccess, toastError]);

  return (
    <form className="grid grid-cols-1 gap-4" action={formAction} noValidate>
      {state?.message ? (
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/60 to-purple-50/60 p-4">
          <p className="text-sm text-gray-700 Ovo">{state.message}</p>
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium text-gray-700 Ovo mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          defaultValue={state?.fields?.email || ""}
          placeholder="you@example.com"
          className="w-full p-3 outline-none border-[0.5px] border-gray-300 rounded-md bg-white"
          inputMode="email"
          autoComplete="email"
        />
        <p className="text-xs text-gray-500 Ovo mt-2">
          We’ll send a secure sign-in link.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Sending…" : "Send sign-in link"}
      </button>
    </form>
  );
}
