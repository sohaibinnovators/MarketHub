import type { Metadata } from "next";
import { SellerProductsManager } from "@/components/dashboard/SellerProductsManager";

export const metadata: Metadata = {
  title: "My Products",
  description: "Manage seller products on MarketHub.",
};

export default function SellerProductsPage() {
  return <SellerProductsManager />;
}
