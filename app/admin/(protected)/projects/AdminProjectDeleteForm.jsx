"use client";

import { useRef, useState, useTransition } from "react";

import { deleteProjectAction } from "@/app/actions/projectsActions";

export default function AdminProjectDeleteForm({ id }) {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pending = isSubmitting || isPending;

  return (
    <form ref={formRef} action={deleteProjectAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="button"
        disabled={pending}
        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-red-600 text-base font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={() => {
          if (pending) return;

          const confirmed = window.confirm(
            "Remove this project? This cannot be undone.",
          );
          if (!confirmed) return;

          setIsSubmitting(true);

          const form = formRef.current;
          if (!form) return;

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
    </form>
  );
}
