import { LiveProductCatalog } from "@/components/catalog/LiveProductCatalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search MarketHub products by name, brand, description, and category.",
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <LiveProductCatalog
        title="Search results"
        subtitle="Find products by name, description, brand, or category. Filters stay synced with the URL."
        basePath="/search"
      />
    </div>
  );
}
