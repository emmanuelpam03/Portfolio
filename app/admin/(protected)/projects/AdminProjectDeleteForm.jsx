"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";

import { deleteProjectAction } from "@/app/actions/projectsActions";

export default function AdminProjectDeleteForm({ id }) {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState(null);

  const pending = isSubmitting || isPending;

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  return (
    <form ref={formRef} action={deleteProjectAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="button"
        disabled={pending}
        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-red-600 text-base font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={() => {
          if (pending) return;

          setConfirmOpen(true);
        }}
      >
        {pending ? "Removing…" : "Remove"}
      </button>

      {confirmOpen && portalTarget
        ? createPortal(
            <div
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
              onClick={() => {
                if (pending) return;
                setConfirmOpen(false);
              }}
            >
              <div
                className="w-full max-w-md rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-xl p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-base font-semibold text-gray-900 Ovo">
                  Remove project?
                </p>
                <p className="text-sm text-gray-600 Ovo mt-2">
                  This cannot be undone.
                </p>

                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={pending}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-red-600 text-sm font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (pending) return;

                      const form = formRef.current;
                      if (!form) return;

                      setIsSubmitting(true);

                      startTransition(() => {
                        if (typeof form.requestSubmit === "function") {
                          form.requestSubmit();
                        } else {
                          form.submit();
                        }
                      });
                    }}
                  >
                    {pending ? "Removing…" : "Remove"}
                  </button>
                </div>
              </div>
            </div>,
            portalTarget,
          )
        : null}
    </form>
  );
}
