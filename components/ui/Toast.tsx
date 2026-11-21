"use client";

import { cn } from "@/lib/utils";

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  tone?: "success" | "error" | "info";
};

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto w-full max-w-sm rounded-2xl border bg-surface px-4 py-3 shadow-lg",
            toast.tone === "error"
              ? "border-rose-200"
              : toast.tone === "info"
                ? "border-border"
                : "border-emerald-200",
          )}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-text">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-xs text-muted">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-md px-1.5 text-sm text-muted hover:bg-slate-100 hover:text-text"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
