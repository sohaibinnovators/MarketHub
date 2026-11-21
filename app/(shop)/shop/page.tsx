import { LiveProductCatalog } from "@/components/catalog/LiveProductCatalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse all products on MarketHub with search, filters, and sorting.",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <LiveProductCatalog
        title="All products"
        subtitle="Browse the full MarketHub catalog. Filter by category, brand, price, rating, and availability."
        basePath="/shop"
      />
    </div>
  );
}
