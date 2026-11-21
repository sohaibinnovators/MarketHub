import type { Metadata } from "next";
import { SellerDashboardOverview } from "@/components/dashboard/SellerDashboardOverview";

export const metadata: Metadata = {
  title: "Seller Dashboard",
  description: "MarketHub seller dashboard overview.",
};

export default function SellerDashboardPage() {
  return <SellerDashboardOverview />;
}
