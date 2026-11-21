import { faqs } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about MarketHub.",
};

export default function FaqPage() {
  const groups = Array.from(new Set(faqs.map((item) => item.category)));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Frequently asked questions"
        subtitle="Answers for this MarketHub portfolio demo experience."
      />
      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
              {group}
            </h2>
            <div className="mt-4 space-y-3">
              {faqs
                .filter((item) => item.category === group)
                .map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-2xl border border-border bg-surface p-4 shadow-sm open:shadow-md"
                  >
                    <summary className="cursor-pointer list-none font-semibold text-text marker:content-none">
                      <span className="flex items-center justify-between gap-3">
                        {item.question}
                        <span className="text-muted transition group-open:rotate-45">
                          +
                        </span>
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.answer}
                    </p>
                  </details>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
