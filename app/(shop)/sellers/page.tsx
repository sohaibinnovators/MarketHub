import type { Metadata } from "next";
import { SellersDirectory } from "@/components/seller/SellersDirectory";

export const metadata: Metadata = {
  title: "All Sellers",
  description: "Discover MarketHub sellers and browse their storefronts.",
};

export default function SellersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SellersDirectory />
    </div>
  );
}
