import { CategoryCard } from "@/components/category/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse MarketHub product categories.",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Categories"
        subtitle="Explore every collection on MarketHub—from electronics to accessories."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="space-y-3">
            <CategoryCard category={category} />
            <p className="text-sm text-muted">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
