"use client";

import { Suspense } from "react";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { useMarketplace } from "@/lib/marketplace";

function CatalogFallback() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
      Loading products...
    </div>
  );
}

function LiveCatalogInner({
  title,
  subtitle,
  lockedCategory,
  basePath,
  sellerId,
}: {
  title?: string;
  subtitle?: string;
  lockedCategory?: string;
  basePath?: string;
  sellerId?: string;
}) {
  const { ready, products, getProductsByCategory, getProductsBySeller } =
    useMarketplace();

  if (!ready) return <CatalogFallback />;

  const source = sellerId
    ? getProductsBySeller(sellerId)
    : lockedCategory
      ? getProductsByCategory(lockedCategory)
      : products;

  return (
    <ProductCatalog
      products={source}
      title={title}
      subtitle={subtitle}
      lockedCategory={lockedCategory}
      basePath={basePath}
    />
  );
}

export function LiveProductCatalog(
  props: {
    title?: string;
    subtitle?: string;
    lockedCategory?: string;
    basePath?: string;
    sellerId?: string;
  },
) {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <LiveCatalogInner {...props} />
    </Suspense>
  );
}
