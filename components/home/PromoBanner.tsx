import Link from "next/link";
import { cn } from "@/lib/utils";

export function PromoBanner({
  title,
  description,
  href,
  cta,
  tone = "indigo",
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  tone?: "indigo" | "blue" | "slate";
}) {
  const tones = {
    indigo: "from-[#312e81] to-[#4338ca]",
    blue: "from-[#1e3a8a] to-[#2563eb]",
    slate: "from-[#0f172a] to-[#334155]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-sm md:p-8",
        tones[tone],
      )}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 right-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="relative max-w-md">
        <h3 className="font-display text-xl font-semibold md:text-2xl">
          {title}
        </h3>
        <p className="mt-2 text-sm text-white/85 md:text-base">{description}</p>
        <Link
          href={href}
          className="mt-5 inline-flex h-10 items-center rounded-xl bg-white px-4 text-sm font-semibold text-primary"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
