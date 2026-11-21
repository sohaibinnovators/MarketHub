import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about MarketHub, a multi-vendor marketplace portfolio project.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              About MarketHub
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-text">
              Built for discovery across many sellers
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              MarketHub is a self-initiated portfolio project that demonstrates a
              premium multi-vendor marketplace experience—from browsing and
              product discovery to cart, checkout, and seller management UI.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Phase 1 focuses entirely on frontend craft: clean architecture,
              reusable components, realistic mock data, and a cohesive visual
              system customers and sellers can navigate with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/shop">Explore the shop</Button>
              <Button href="/seller-dashboard" variant="outline">
                View seller dashboard
              </Button>
            </div>
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80"
              alt="People collaborating around a marketplace concept"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          {
            title: "Customer-first browsing",
            body: "Clear navigation, searchable catalogs, and product pages designed for confident purchasing decisions.",
          },
          {
            title: "Seller-ready surfaces",
            body: "A dedicated dashboard preview for listings, orders, sales overview, and store profile management.",
          },
          {
            title: "Portfolio-grade polish",
            body: "Consistent typography, spacing, and interaction patterns across every customer and seller screen.",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
          >
            <h2 className="font-display text-xl font-semibold text-text">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
