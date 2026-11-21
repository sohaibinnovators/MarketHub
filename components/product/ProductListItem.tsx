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

export function ProductListItem({ product }: { product: Product }) {
  const seller =
    getLiveSellers().find((entry) => entry.id === product.sellerId) ??
    getSellerById(product.sellerId);
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);
  const imageData = product.image.startsWith("data:");

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-stretch">
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:aspect-square sm:w-40"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="160px"
          unoptimized={imageData}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap gap-1.5">
          {product.badges.slice(0, 2).map((badge) => (
            <Badge key={badge} tone={badge}>
              {badge}
            </Badge>
          ))}
          {product.stock <= 0 ? (
            <Badge tone="default">Out of stock</Badge>
          ) : null}
        </div>
        <Link
          href={`/seller/${seller?.slug ?? ""}`}
          className="mt-2 text-xs font-medium text-muted hover:text-primary"
        >
          {seller?.name} · {product.brand}
        </Link>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 text-base font-semibold text-text hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted">
          {product.description}
        </p>
        <div className="mt-2">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-text">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice ? (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            ) : null}
            {discount ? (
              <span className="text-xs font-semibold text-rose-700">
                -{discount}%
              </span>
            ) : null}
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleWishlist(product.id)}
            >
              {wishlisted ? "Saved" : "Save"}
            </Button>
            <Button
              size="sm"
              onClick={() => addToCart(product.id)}
              disabled={product.stock <= 0}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
