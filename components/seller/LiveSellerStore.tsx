"use client";

import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { StarRating } from "@/components/ui/StarRating";
import { useMarketplace } from "@/lib/marketplace";

function CatalogFallback() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
      Loading store products...
    </div>
  );
}

export function LiveSellerStore({ slug }: { slug: string }) {
  const { ready, getSellerBySlug, getProductsBySeller } = useMarketplace();

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-muted sm:px-6 lg:px-8">
        Loading store...
      </div>
    );
  }

  const seller = getSellerBySlug(slug);
  if (!seller) notFound();

  const sellerProducts = getProductsBySeller(seller.id);
  const logoData = seller.logo.startsWith("data:");
  const coverData = seller.coverImage.startsWith("data:");

  return (
    <div>
      <div className="relative h-48 w-full bg-slate-200 md:h-64">
        <Image
          src={seller.coverImage}
          alt={`${seller.name} cover`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          unoptimized={coverData}
        />
        <div className="absolute inset-0 bg-[#172033]/35" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 flex flex-col gap-6 rounded-3xl border border-border bg-surface p-6 shadow-sm md:-mt-16 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="flex gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-white shadow-md md:h-24 md:w-24">
              <Image
                src={seller.logo}
                alt={`${seller.name} logo`}
                fill
                className="object-cover"
                sizes="96px"
                unoptimized={logoData}
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-semibold text-text md:text-3xl">
                  {seller.name}
                </h1>
                {seller.verified ? (
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted">{seller.tagline}</p>
              <div className="mt-2">
                <StarRating
                  rating={seller.rating}
                  reviewCount={seller.reviewCount}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center md:text-right">
            <div>
              <p className="text-lg font-bold text-text">
                {seller.productCount}
              </p>
              <p className="text-xs text-muted">Products</p>
            </div>
            <div>
              <p className="text-lg font-bold text-text">{seller.joinedYear}</p>
              <p className="text-xs text-muted">Joined</p>
            </div>
            <div>
              <p className="text-lg font-bold text-text">{seller.location}</p>
              <p className="text-xs text-muted">Based in</p>
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
          {seller.description}
        </p>

        <section className="py-12">
          <Suspense fallback={<CatalogFallback />}>
            <ProductCatalog
              products={sellerProducts}
              title="Store products"
              subtitle={`Browse and filter items currently listed by ${seller.name}.`}
              basePath={`/seller/${seller.slug}`}
            />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
