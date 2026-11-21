import type { Metadata } from "next";
import { OrdersListView } from "@/components/orders/OrdersListView";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Demo customer order history on MarketHub.",
};

export default function AccountOrdersPage() {
  return <OrdersListView />;
}
