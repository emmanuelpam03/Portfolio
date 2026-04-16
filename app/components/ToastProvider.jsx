"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Check, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);

function makeId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeMessage(message) {
  const text = typeof message === "string" ? message.trim() : "";
  return text.length ? text : null;
}

const VARIANT_STYLES = {
  success: {
    icon: Check,
    border: "border-green-200",
    iconBg: "bg-green-600",
  },
  error: {
    icon: AlertTriangle,
    border: "border-red-200",
    iconBg: "bg-red-600",
  },
  info: {
    icon: AlertTriangle,
    border: "border-gray-200",
    iconBg: "bg-gray-700",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const portalTarget = typeof document === "undefined" ? null : document.body;

  useEffect(() => {
    const timeouts = timeoutsRef.current;

    return () => {
      for (const timeoutId of timeouts.values()) {
        window.clearTimeout(timeoutId);
      }
      timeouts.clear();
    };
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    ({ message, variant = "info", duration }) => {
      const text = normalizeMessage(message);
      if (!text) return;

      const safeVariant =
        variant === "success" || variant === "error" || variant === "info"
          ? variant
          : "info";

      const id = makeId();
      const toast = { id, message: text, variant: safeVariant };

      setToasts((prev) => [...prev, toast]);

      const defaultDuration = safeVariant === "error" ? 6500 : 4500;
      const ms =
        typeof duration === "number" && Number.isFinite(duration)
          ? duration
          : defaultDuration;

      if (ms > 0) {
        const timeoutId = window.setTimeout(() => {
          removeToast(id);
        }, ms);
        timeoutsRef.current.set(id, timeoutId);
      }
    },
    [removeToast],
  );

  const api = useMemo(
    () => ({
      toast: (message, options) => addToast({ message, ...(options ?? {}) }),
      success: (message, options) =>
        addToast({ message, ...(options ?? {}), variant: "success" }),
      error: (message, options) =>
        addToast({ message, ...(options ?? {}), variant: "error" }),
    }),
    [addToast],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {portalTarget
        ? createPortal(
            <div
              className="pointer-events-none fixed right-4 top-4 flex w-[min(92vw,420px)] flex-col gap-3"
              style={{ zIndex: 2147483000 }}
              aria-live="polite"
              aria-relevant="additions"
            >
              <AnimatePresence initial={false}>
                {toasts.map((toast) => {
                  const styles =
                    VARIANT_STYLES[toast.variant] ?? VARIANT_STYLES.info;
                  const Icon = styles.icon;

                  return (
                    <motion.div
                      key={toast.id}
                      initial={{ opacity: 0, x: 24, y: -6 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, x: 24, y: -6 }}
                      transition={{ duration: 0.22 }}
                      layout
                      className={`pointer-events-auto overflow-hidden rounded-2xl border bg-white/95 shadow-xl backdrop-blur-xl ${styles.border}`}
                      role={toast.variant === "error" ? "alert" : "status"}
                    >
                      <div className="flex items-start gap-3 p-4">
                        <span
                          className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl text-white ${styles.iconBg}`}
                          aria-hidden="true"
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-800 Ovo break-words">
                            {toast.message}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeToast(toast.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          aria-label="Dismiss notification"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>,
            portalTarget,
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return value;
}
