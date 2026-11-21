"use client";

import { ProductGrid } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { useExperience } from "@/lib/experience";
import { useMarketplace } from "@/lib/marketplace";

export function RecentlyViewedSection({
  limit = 4,
  showEmpty = false,
  title,
}: {
  limit?: number;
  showEmpty?: boolean;
  title?: string;
}) {
  const { ready: experienceReady, recentlyViewedIds } = useExperience();
  const { ready: catalogReady, getProductById } = useMarketplace();

  if (!experienceReady || !catalogReady) {
    if (!showEmpty) return null;
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading recently viewed...
      </div>
    );
  }

  const products = recentlyViewedIds
    .map((id) => getProductById(id))
    .filter(Boolean)
    .slice(0, limit) as NonNullable<ReturnType<typeof getProductById>>[];

  if (products.length === 0) {
    if (!showEmpty) return null;
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <p className="font-display text-2xl font-semibold">
          No recently viewed products
        </p>
        <p className="mt-2 text-sm text-muted">
          Open any product detail page to start building this list.
        </p>
        <Button href="/shop" className="mt-6">
          Browse shop
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title ? (
        <h2 className="font-display text-lg font-semibold text-text">{title}</h2>
      ) : null}
      <ProductGrid products={products} />
    </div>
  );
}
