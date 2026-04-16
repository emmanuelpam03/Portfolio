"use client";

import { useEffect, useRef } from "react";

import { useToast } from "@/app/components/ToastProvider";

export default function ToastOnMount({ message, variant = "info" }) {
  const { toast, success, error } = useToast();
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;

    const text = typeof message === "string" ? message.trim() : "";
    if (!text) return;

    shownRef.current = true;

    if (variant === "success") {
      success(text);
      return;
    }

    if (variant === "error") {
      error(text);
      return;
    }

    toast(text);
  }, [message, variant, toast, success, error]);

  return null;
}
