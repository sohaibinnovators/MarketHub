import type { Metadata } from "next";
import { OrdersListView } from "@/components/orders/OrdersListView";

export const metadata: Metadata = {
  title: "Orders",
  description: "View your MarketHub demo order history.",
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <OrdersListView />
    </div>
  );
}
