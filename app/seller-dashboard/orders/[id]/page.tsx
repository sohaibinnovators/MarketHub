import { Suspense } from "react";
import type { Metadata } from "next";
import { SellerOrderDetailView } from "@/components/seller/SellerOrderDetailView";

export const metadata: Metadata = {
  title: "Order Details",
  description: "Seller order detail view on MarketHub.",
};

export default function SellerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
          Loading order...
        </div>
      }
    >
      <SellerOrderDetailView params={params} />
    </Suspense>
  );
}
