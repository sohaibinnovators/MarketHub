import type { Metadata } from "next";
import { SellerSalesOverview } from "@/components/dashboard/SellerSalesOverview";

export const metadata: Metadata = {
  title: "Sales Overview",
  description: "Seller sales overview on MarketHub.",
};

export default function SalesOverviewPage() {
  return <SellerSalesOverview />;
}
