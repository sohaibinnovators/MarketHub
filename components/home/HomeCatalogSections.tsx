"use client";

import { PromoBanner } from "@/components/home/PromoBanner";
import { ProductGrid } from "@/components/product/ProductCard";
import { RecentlyViewedSection } from "@/components/product/RecentlyViewedSection";
import { SellerCard } from "@/components/seller/SellerCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useExperience } from "@/lib/experience";
import { useMarketplace } from "@/lib/marketplace";

export function HomeCatalogSections() {
  const { ready, products, sellers } = useMarketplace();
  const { recentlyViewedIds } = useExperience();

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-muted sm:px-6 lg:px-8">
        Loading marketplace highlights...
      </div>
    );
  }

  const featured = products.filter((product) => product.isFeatured).slice(0, 4);
  const trending = products.filter((product) => product.isTrending).slice(0, 4);
  const bestSellers = [...products]
    .filter((product) => product.isBestSeller)
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 4);
  const recentlyAdded = [...products]
    .filter((product) => product.isNew)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);
  const featuredSellers = sellers.slice(0, 3);

  return (
    <>
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            title="Featured products"
            subtitle="Handpicked marketplace highlights from top sellers."
            href="/shop?sort=featured"
          />
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          title="Trending now"
          subtitle="Products shoppers are discovering this week."
          href="/shop?sort=bestselling"
        />
        <ProductGrid products={trending} />
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            title="Best sellers"
            subtitle="Customer favorites ranked by demo sales volume."
            href="/shop?sort=bestselling"
          />
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          title="Featured sellers"
          subtitle="Meet trusted vendors shaping the MarketHub community."
          href="/sellers"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {featuredSellers.map((seller) => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      </section>

      {recentlyViewedIds.length > 0 ? (
        <section className="bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeader
              title="Recently viewed"
              subtitle="Pick up where you left off in this browser."
              href="/account/recently-viewed"
            />
            <RecentlyViewedSection limit={4} />
          </div>
        </section>
      ) : null}

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            title="Special offers"
            subtitle="Seasonal promotions and curated savings across top categories."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <PromoBanner
              title="Tech Week Savings"
              description="Save on wireless audio, power gear, and smart essentials from NovaTech Labs."
              href="/categories/electronics"
              cta="Shop Electronics"
              tone="indigo"
            />
            <PromoBanner
              title="Home Refresh Event"
              description="Upgrade living spaces with selected Haven & Co. pieces at limited-time prices."
              href="/categories/home-living"
              cta="Shop Home"
              tone="blue"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          title="Recently added"
          subtitle="Fresh listings from sellers across the marketplace."
          href="/shop?sort=newest"
        />
        <ProductGrid products={recentlyAdded} />
        <div className="mt-10 text-center">
          <Button href="/shop" variant="outline" size="lg">
            View all products
          </Button>
        </div>
      </section>
    </>
  );
}
