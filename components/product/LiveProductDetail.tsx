"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductCard";
import { RecentlyViewedSection } from "@/components/product/RecentlyViewedSection";
import { ProductReviewsSection } from "@/components/reviews/ProductReviewsSection";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StarRating } from "@/components/ui/StarRating";
import { formatPrice, getCategoryBySlug, getDiscountPercent } from "@/lib/data";
import { useExperience } from "@/lib/experience";
import { useMarketplace } from "@/lib/marketplace";

export function LiveProductDetail({ slug }: { slug: string }) {
  const { ready, getProductBySlug, getSellerById, products } = useMarketplace();
  const { trackProductView } = useExperience();

  const product = ready ? getProductBySlug(slug) : undefined;

  useEffect(() => {
    if (product?.id) trackProductView(product.id);
  }, [product?.id, trackProductView]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted sm:px-6 lg:px-8">
        Loading product...
      </div>
    );
  }

  if (!product) notFound();

  const seller = getSellerById(product.sellerId);
  const category = getCategoryBySlug(product.categorySlug);
  const related = products
    .filter(
      (entry) =>
        entry.id !== product.id &&
        (entry.categorySlug === product.categorySlug ||
          entry.sellerId === product.sellerId),
    )
    .slice(0, 4);
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const logoData = seller?.logo.startsWith("data:") ?? false;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/shop" className="hover:text-primary">
              Shop
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/categories/${product.categorySlug}`}
              className="hover:text-primary"
            >
              {category?.name ?? product.categorySlug}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-text">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <div className="flex flex-wrap gap-2">
            {product.badges.map((badge) => (
              <Badge key={badge} tone={badge}>
                {badge}
              </Badge>
            ))}
            {product.stock <= 0 ? (
              <Badge tone="default">Out of stock</Badge>
            ) : null}
          </div>
          <p className="mt-4 text-sm font-medium text-muted">{product.brand}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-text md:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3">
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="md"
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            Demo sales volume: {product.salesCount.toLocaleString()} units
          </p>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-text">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice ? (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            ) : null}
            {discount ? (
              <span className="rounded-md bg-rose-50 px-2 py-1 text-sm font-semibold text-rose-700">
                Save {discount}%
              </span>
            ) : null}
          </div>
          <p className="mt-5 text-base leading-relaxed text-muted">
            {product.longDescription}
          </p>

          {seller ? (
            <Link
              href={`/seller/${seller.slug}`}
              className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 pr-5 transition hover:border-primary"
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                <Image
                  src={seller.logo}
                  alt={seller.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                  unoptimized={logoData}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">{seller.name}</p>
                <p className="text-xs text-muted">
                  {seller.verified ? "Verified seller · " : ""}
                  {seller.location} · {seller.productCount} products
                </p>
              </div>
            </Link>
          ) : null}

          <div className="mt-8">
            <ProductActions product={product} />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                Features
              </h2>
              <ul className="mt-3 space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="text-sm text-text">
                    · {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                Specs
              </h2>
              <dl className="mt-3 space-y-2">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <dt className="text-muted">{spec.label}</dt>
                    <dd className="font-medium text-text">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <ProductReviewsSection productId={product.id} />

      <section className="mt-16">
        <SectionHeader
          title="Related products"
          subtitle="More picks from the same category or seller."
        />
        <ProductGrid products={related} />
      </section>

      <section className="mt-16">
        <SectionHeader
          title="Recently viewed"
          subtitle="Products you opened in this browser session history."
          href="/account/recently-viewed"
        />
        <RecentlyViewedSection limit={4} />
      </section>
    </div>
  );
}
