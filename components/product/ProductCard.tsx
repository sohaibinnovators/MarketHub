"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { formatPrice, getDiscountPercent, getSellerById } from "@/lib/data";
import { getLiveSellers } from "@/lib/catalog-registry";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const seller =
    getLiveSellers().find((entry) => entry.id === product.sellerId) ??
    getSellerById(product.sellerId);
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);
  const imageData = product.image.startsWith("data:");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <Link
          href={`/product/${product.slug}`}
          className="relative block h-full w-full"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            unoptimized={imageData}
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badges.slice(0, 2).map((badge) => (
            <Badge key={badge} tone={badge}>
              {badge}
            </Badge>
          ))}
        </div>
        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-3 top-3 rounded-full border border-border bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-text shadow-sm transition hover:text-primary"
        >
          <span className={wishlisted ? "text-primary" : ""}>
            {wishlisted ? "Saved" : "Save"}
          </span>
        </button>
        {discount ? (
          <span className="absolute bottom-3 left-3 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/seller/${seller?.slug ?? ""}`}
            className="text-xs font-medium text-muted hover:text-primary"
          >
            {seller?.name}
          </Link>
          <span className="truncate text-[11px] text-muted">{product.brand}</span>
        </div>
        {product.stock <= 0 ? (
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-danger">
            Out of stock
          </p>
        ) : null}
        <Link href={`/product/${product.slug}`} className="mt-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-text transition group-hover:text-primary md:text-[15px]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-text">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice ? (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>
        <Button
          className="mt-4 w-full"
          size="sm"
          onClick={() => addToCart(product.id)}
          disabled={product.stock <= 0}
        >
          {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <p className="text-lg font-semibold text-text">No products found</p>
        <p className="mt-2 text-sm text-muted">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
