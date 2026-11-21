import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const styles: Record<string, string> = {
  New: "bg-secondary/10 text-secondary",
  "Best Seller": "bg-amber-50 text-amber-700",
  Sale: "bg-rose-50 text-rose-700",
  Limited: "bg-violet-50 text-violet-700",
  Trending: "bg-emerald-50 text-emerald-700",
  default: "bg-slate-100 text-slate-700",
};

export function Badge({
  children,
  tone,
  className,
}: {
  children: ReactNode;
  tone?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        styles[tone ?? "default"] ?? styles.default,
        className,
      )}
    >
      {children}
    </span>
  );
}
