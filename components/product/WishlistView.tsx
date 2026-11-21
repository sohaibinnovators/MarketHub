"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatPrice } from "@/lib/data";
import { useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";

export function WishlistView() {
  const {
    ready: storeReady,
    wishlist,
    removeFromWishlist,
    moveWishlistToCart,
    addToCart,
  } = useStore();
  const { ready: catalogReady, products, getSellerById } = useMarketplace();

  if (!storeReady || !catalogReady) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading wishlist...
      </div>
    );
  }

  const items = products.filter((product) => wishlist.includes(product.id));

  return (
    <div>
      <SectionHeader
        title="Wishlist"
        subtitle="Saved products you can move to cart anytime."
      />
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold text-text">
            No saved items yet
          </p>
          <p className="mt-2 text-sm text-muted">
            Tap Save on any product card to add it here.
          </p>
          <Button href="/shop" className="mt-6">
            Browse products
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((product) => {
            const seller = getSellerById(product.sellerId);
            const outOfStock = product.stock <= 0;
            const imageData = product.image.startsWith("data:");
            return (
              <article
                key={product.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-24"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized={imageData}
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-semibold text-text hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {seller?.name} · {product.brand}
                  </p>
                  <p className="mt-2 text-base font-bold text-text">
                    {formatPrice(product.price)}
                  </p>
                  {outOfStock ? (
                    <p className="mt-1 text-xs font-semibold text-danger">
                      Out of stock
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
                  <Button
                    size="sm"
                    disabled={outOfStock}
                    onClick={() => moveWishlistToCart(product.id)}
                  >
                    Move to cart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={outOfStock}
                    onClick={() => addToCart(product.id)}
                  >
                    Add to cart
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    Remove
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
