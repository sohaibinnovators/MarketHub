import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderDetailView } from "@/components/orders/OrderDetailView";

export const metadata: Metadata = {
  title: "Order Details",
  description: "MarketHub demo order details.",
};

async function OrderDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailView orderId={decodeURIComponent(id)} />;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
            Loading order...
          </div>
        }
      >
        <OrderDetailContent params={params} />
      </Suspense>
    </div>
  );
}
