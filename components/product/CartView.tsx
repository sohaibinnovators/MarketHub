"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  FREE_SHIPPING_THRESHOLD,
  formatMoney,
  resolveCartLines,
} from "@/lib/cart";
import { useStore } from "@/lib/store";

export function CartView() {
  const {
    ready,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isInWishlist,
    getCartTotals,
  } = useStore();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading cart...
      </div>
    );
  }

  const lines = resolveCartLines(cart);
  const totals = getCartTotals("standard");

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-text">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-muted">
          Browse the shop and add products to get started.
        </p>
        <Button href="/shop" className="mt-6">
          Continue shopping
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          title="Shopping cart"
          subtitle="Review your selected items before checkout. Totals use demo shipping rules."
          className="mb-0"
        />
        {!confirmClear ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmClear(true)}
          >
            Clear cart
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Clear all items?</span>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                clearCart();
                setConfirmClear(false);
              }}
            >
              Confirm
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirmClear(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {lines.map((line) => {
            const wishlisted = isInWishlist(line.productId);
            return (
              <article
                key={`${line.productId}-${line.variantLabel ?? "default"}`}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <Link
                  href={`/product/${line.product.slug}`}
                  className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-24"
                >
                  <Image
                    src={line.product.image}
                    alt={line.product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    href={`/product/${line.product.slug}`}
                    className="font-semibold text-text hover:text-primary"
                  >
                    {line.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {line.sellerName} · {line.product.brand}
                  </p>
                  {line.variantLabel ? (
                    <p className="mt-1 text-xs text-muted">{line.variantLabel}</p>
                  ) : null}
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-text">
                      {formatMoney(line.unitPrice)}
                    </span>
                    {line.originalPrice ? (
                      <span className="text-xs text-muted line-through">
                        {formatMoney(line.originalPrice)}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex overflow-hidden rounded-lg border border-border">
                      <button
                        type="button"
                        className="h-9 w-9 hover:bg-slate-50"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateCartQuantity(
                            line.productId,
                            line.quantity - 1,
                            line.variantLabel,
                          )
                        }
                      >
                        −
                      </button>
                      <span className="flex h-9 w-10 items-center justify-center border-x border-border text-sm">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        className="h-9 w-9 hover:bg-slate-50 disabled:opacity-40"
                        aria-label="Increase quantity"
                        disabled={line.quantity >= line.maxQuantity}
                        onClick={() =>
                          updateCartQuantity(
                            line.productId,
                            line.quantity + 1,
                            line.variantLabel,
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(line.productId, line.variantLabel)
                      }
                      className="text-sm font-medium text-danger hover:underline"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!wishlisted) toggleWishlist(line.productId);
                        removeFromCart(line.productId, line.variantLabel);
                      }}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {wishlisted ? "Remove & keep saved" : "Move to wishlist"}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {line.maxQuantity} available (demo stock)
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-base font-bold text-text">
                    {formatMoney(line.lineTotal)}
                  </p>
                  {line.lineSavings > 0 ? (
                    <p className="mt-1 text-xs font-medium text-success">
                      Save {formatMoney(line.lineSavings)}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-text">
            Order summary
          </h2>
          <p className="mt-1 text-xs text-muted">
            Demo shipping: free standard over {formatMoney(FREE_SHIPPING_THRESHOLD)}.
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium">{formatMoney(totals.subtotal)}</dd>
            </div>
            {totals.savings > 0 ? (
              <div className="flex justify-between text-success">
                <dt>Product savings</dt>
                <dd className="font-medium">-{formatMoney(totals.savings)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-muted">Est. shipping (standard)</dt>
              <dd className="font-medium">
                {totals.shippingCost === 0
                  ? "Free"
                  : formatMoney(totals.shippingCost)}
              </dd>
            </div>
            {totals.freeShippingRemaining !== null ? (
              <p className="rounded-xl bg-primary/5 px-3 py-2 text-xs text-primary">
                Add {formatMoney(totals.freeShippingRemaining)} more for free
                standard shipping.
              </p>
            ) : null}
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-semibold">Estimated total</dt>
              <dd className="font-bold">{formatMoney(totals.total)}</dd>
            </div>
          </dl>
          <Button href="/checkout" className="mt-5 w-full" size="lg">
            Proceed to Checkout
          </Button>
          <Button href="/shop" variant="ghost" className="mt-2 w-full">
            Continue shopping
          </Button>
        </aside>
      </div>
    </div>
  );
}
