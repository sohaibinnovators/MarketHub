import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the MarketHub team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Contact us"
        subtitle="Questions about this demo, partnerships, or future phases? Send a message."
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <ContactForm />
        <aside className="h-fit space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Email
            </h2>
            <p className="mt-1 text-sm text-text">hello@markethub.demo</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Hours
            </h2>
            <p className="mt-1 text-sm text-text">Mon–Fri, 9:00–18:00 CT</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Note
            </h2>
            <p className="mt-1 text-sm text-muted">
              This contact form is frontend-only and does not send real messages
              in Phase 1.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
