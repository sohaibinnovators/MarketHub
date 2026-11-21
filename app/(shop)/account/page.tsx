import type { Metadata } from "next";
import { CustomerDashboardOverview } from "@/components/account/CustomerDashboardOverview";

export const metadata: Metadata = {
  title: "Customer Dashboard",
  description: "MarketHub demo customer dashboard overview.",
};

export default function AccountPage() {
  return <CustomerDashboardOverview />;
}
