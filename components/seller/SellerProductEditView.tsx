"use client";

import { use } from "react";
import { Button } from "@/components/ui/Button";
import { SellerProductForm } from "@/components/seller/SellerProductForm";
import { useMarketplace } from "@/lib/marketplace";

export function SellerProductEditView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { ready, sellerProducts } = useMarketplace();
  const product = sellerProducts.find((entry) => entry.id === id);

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Product not found</h1>
        <p className="mt-2 text-sm text-muted">
          This listing may have been deleted or does not belong to the demo
          seller.
        </p>
        <Button href="/seller-dashboard/products" className="mt-6">
          Back to products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">
          Edit product
        </h1>
        <p className="mt-2 text-sm text-muted">
          Update listing details for “{product.name}”.
        </p>
      </div>
      <SellerProductForm mode="edit" initial={product} />
    </div>
  );
}
