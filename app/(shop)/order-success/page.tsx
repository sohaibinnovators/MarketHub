import { Suspense } from "react";
import { OrderSuccessView } from "@/components/orders/OrderSuccessView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Success",
  description: "Your MarketHub demo order confirmation.",
};

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-12 text-sm text-muted">
          Loading confirmation...
        </div>
      }
    >
      <OrderSuccessView />
    </Suspense>
  );
}
