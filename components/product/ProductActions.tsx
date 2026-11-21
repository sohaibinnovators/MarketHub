"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useExperience } from "@/lib/experience";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist, notify } = useStore();
  const { addToCompare, removeFromCompare, isInCompare, compareIds } =
    useExperience();
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.variants?.forEach((variant) => {
      initial[variant.name] = variant.options[0] ?? "";
    });
    return initial;
  });

  const wishlisted = isInWishlist(product.id);
  const comparing = isInCompare(product.id);
  const outOfStock = product.stock <= 0;

  const variantLabel = useMemo(() => {
    const parts = Object.entries(selected)
      .filter(([, value]) => value)
      .map(([name, value]) => `${name}: ${value}`);
    return parts.length > 0 ? parts.join(" · ") : undefined;
  }, [selected]);

  return (
    <div className="space-y-5">
      {product.variants?.map((variant) => (
        <div key={variant.name}>
          <p className="text-sm font-medium text-text">{variant.name}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setSelected((prev) => ({ ...prev, [variant.name]: option }))
                }
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm font-medium transition",
                  selected[variant.name] === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-surface text-text hover:border-primary/40",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      {!product.variants?.length && product.colors?.length ? (
        <div>
          <p className="text-sm font-medium text-text">Color</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <span
                key={color}
                className="rounded-xl border border-border px-3 py-2 text-sm text-text"
              >
                {color}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="qty" className="text-sm font-medium text-text">
          Quantity
        </label>
        <div className="inline-flex overflow-hidden rounded-xl border border-border">
          <button
            type="button"
            className="h-11 w-11 hover:bg-slate-50 disabled:opacity-40"
            disabled={outOfStock}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="qty"
            type="number"
            min={1}
            max={Math.max(product.stock, 1)}
            value={quantity}
            disabled={outOfStock}
            onChange={(event) =>
              setQuantity(
                Math.min(
                  Math.max(product.stock, 1),
                  Math.max(1, Number(event.target.value) || 1),
                ),
              )
            }
            className="h-11 w-14 border-x border-border text-center outline-none disabled:bg-slate-50"
          />
          <button
            type="button"
            className="h-11 w-11 hover:bg-slate-50 disabled:opacity-40"
            disabled={outOfStock}
            onClick={() =>
              setQuantity((value) =>
                Math.min(Math.max(product.stock, 1), value + 1),
              )
            }
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <span
          className={cn(
            "text-sm font-medium",
            outOfStock ? "text-danger" : "text-muted",
          )}
        >
          {outOfStock ? "Out of stock" : `${product.stock} in stock`}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="flex-1"
          size="lg"
          disabled={outOfStock}
          onClick={() => {
            const result = addToCart(product.id, quantity, variantLabel);
            if (result.ok) setQuantity(1);
          }}
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button
          className="flex-1"
          size="lg"
          variant="outline"
          onClick={() => toggleWishlist(product.id)}
        >
          {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </Button>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="flex-1"
          size="lg"
          variant="ghost"
          onClick={() => {
            if (comparing) {
              removeFromCompare(product.id);
              notify({ title: "Removed from comparison", tone: "info" });
              return;
            }
            const result = addToCompare(product.id);
            notify({
              title: result.ok ? "Added to comparison" : result.message,
              description: result.ok
                ? `${compareIds.length + 1}/3 selected`
                : undefined,
              tone: result.ok ? "success" : "error",
            });
          }}
        >
          {comparing ? "Remove from Compare" : "Add to Compare"}
        </Button>
        {compareIds.length > 0 ? (
          <Button href="/compare" className="flex-1" size="lg" variant="outline">
            View comparison ({compareIds.length}/3)
          </Button>
        ) : null}
      </div>
    </div>
  );
}
