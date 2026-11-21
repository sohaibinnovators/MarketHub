import Link from "next/link";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "View all",
  className,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-text md:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="text-sm font-semibold text-primary hover:text-primary-dark"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
