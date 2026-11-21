"use client";

import { useMemo, useState } from "react";
import { SellerCard } from "@/components/seller/SellerCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories } from "@/lib/data";
import { useMarketplace } from "@/lib/marketplace";

export function SellersDirectory() {
  const { ready, sellers, products } = useMarketplace();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [category, setCategory] = useState("all");

  const locations = useMemo(
    () =>
      Array.from(new Set(sellers.map((seller) => seller.location))).sort(),
    [sellers],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sellers.filter((seller) => {
      if (location !== "all" && seller.location !== location) return false;
      if (q) {
        const haystack = `${seller.name} ${seller.tagline} ${seller.location}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (category !== "all") {
        const hasCategory = products.some(
          (product) =>
            product.sellerId === seller.id &&
            product.categorySlug === category,
        );
        if (!hasCategory) return false;
      }
      return true;
    });
  }, [sellers, products, query, location, category]);

  const featured = sellers.filter((seller) => seller.verified).slice(0, 3);

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading sellers...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text md:text-4xl">
          All sellers
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">
          Discover MarketHub vendors, compare store ratings, and browse each
          seller’s live product catalog.
        </p>
      </div>

      <section>
        <SectionHeader
          title="Featured sellers"
          subtitle="Verified demo stores highlighted for discovery."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((seller) => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm md:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search sellers..."
          className="h-11 flex-1 rounded-xl border border-border px-3 text-sm outline-none focus:border-primary"
        />
        <select
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="h-11 rounded-xl border border-border px-3 text-sm"
          aria-label="Filter by location"
        >
          <option value="all">All locations</option>
          {locations.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-11 rounded-xl border border-border px-3 text-sm"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((entry) => (
            <option key={entry.id} value={entry.slug}>
              {entry.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold">No sellers found</p>
          <p className="mt-2 text-sm text-muted">
            Try a different search or clear location and category filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((seller) => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      )}
    </div>
  );
}
