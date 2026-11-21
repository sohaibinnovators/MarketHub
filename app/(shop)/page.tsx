import Image from "next/image";
import Link from "next/link";
import { CategoryCard } from "@/components/category/CategoryCard";
import { HomeCatalogSections } from "@/components/home/HomeCatalogSections";
import { Newsletter } from "@/components/layout/Newsletter";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-[#0b1220]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=80"
            alt="Marketplace shopping atmosphere"
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220] via-[#0b1220]/85 to-[#0b1220]/35" />
        </div>
        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <p className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            MarketHub
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl md:text-4xl">
            One Marketplace. Endless Possibilities.
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-200 md:text-lg">
            Discover curated products from independent sellers across fashion,
            electronics, home, beauty, and more—built for a smooth shopping
            experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/shop" size="lg">
              Explore Shop
            </Button>
            <Button
              href="/categories"
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary"
            >
              Browse Categories
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          title="Shop by category"
          subtitle="Explore curated collections from across the marketplace."
          href="/categories"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <HomeCatalogSections />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-[#172033] text-white md:grid md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">
              For sellers
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Grow your store on MarketHub
            </h2>
            <p className="mt-3 text-sm text-slate-300 md:text-base">
              Manage products, track orders, and present a polished storefront
              with the seller dashboard.
            </p>
            <div className="mt-6">
              <Button href="/seller-dashboard" size="lg">
                Open Seller Dashboard
              </Button>
            </div>
          </div>
          <div className="relative min-h-56 md:min-h-full">
            <Image
              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80"
              alt="Seller preparing marketplace products"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <Newsletter />

      <section className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted">
          Looking for help? Visit our{" "}
          <Link href="/faq" className="font-semibold text-primary">
            FAQ
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="font-semibold text-primary">
            Contact
          </Link>{" "}
          page.
        </p>
      </section>
    </>
  );
}
