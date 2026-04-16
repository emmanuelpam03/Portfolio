"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import AdminSidebar from "@/app/admin/AdminSidebar";

export default function AdminMobileMenu() {
  const detailsRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") details.open = false;
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <details
      ref={detailsRef}
      className="relative"
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
    >
      <summary className="list-none px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer select-none">
        Menu
      </summary>

      {typeof document !== "undefined" &&
        isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000]">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => {
                if (detailsRef.current) detailsRef.current.open = false;
              }}
            />

            <div className="absolute top-4 right-4 left-4">
              <div className="max-w-md ml-auto">
                <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-3">
                  <div className="flex items-center justify-between px-2 py-2">
                    <p className="text-sm font-semibold text-gray-900 Ovo">
                      Admin menu
                    </p>
                    <button
                      type="button"
                      className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium"
                      onClick={() => {
                        if (detailsRef.current) detailsRef.current.open = false;
                      }}
                    >
                      Close
                    </button>
                  </div>

                  <div
                    className="p-2"
                    onClick={() => {
                      if (detailsRef.current) detailsRef.current.open = false;
                    }}
                  >
                    <AdminSidebar />
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </details>
  );
}
