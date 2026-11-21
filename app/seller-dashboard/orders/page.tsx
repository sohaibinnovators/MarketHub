import type { Metadata } from "next";
import { SellerOrdersManager } from "@/components/dashboard/SellerOrdersManager";

export const metadata: Metadata = {
  title: "Orders",
  description: "Seller order management on MarketHub.",
};

export default function SellerOrdersPage() {
  return <SellerOrdersManager />;
}
