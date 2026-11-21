import { Suspense } from "react";
import type { Metadata } from "next";
import { SellerProductEditView } from "@/components/seller/SellerProductEditView";

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit a MarketHub seller product listing.",
};

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
          Loading product...
        </div>
      }
    >
      <SellerProductEditView params={params} />
    </Suspense>
  );
}
