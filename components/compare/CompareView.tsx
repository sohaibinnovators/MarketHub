"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { categories, formatPrice } from "@/lib/data";
import { useExperience } from "@/lib/experience";
import { useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";

export function CompareView() {
  const {
    ready: experienceReady,
    compareIds,
    removeFromCompare,
    clearCompare,
  } = useExperience();
  const { ready: catalogReady, getProductById, getSellerById } =
    useMarketplace();
  const { addToCart, notify } = useStore();

  if (!experienceReady || !catalogReady) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading comparison...
      </div>
    );
  }

  const products = compareIds
    .map((id) => getProductById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProductById>>[];

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">
          No products to compare
        </h1>
        <p className="mt-2 text-sm text-muted">
          Add up to 3 products from product pages or cards, then return here.
        </p>
        <Button href="/shop" className="mt-6">
          Browse products
        </Button>
      </div>
    );
  }

  const rows: Array<{
    label: string;
    render: (product: (typeof products)[number]) => ReactNode;
  }> = [
    {
      label: "Image",
      render: (product) => (
        <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="112px"
            unoptimized={product.image.startsWith("data:")}
          />
        </div>
      ),
    },
    {
      label: "Name",
      render: (product) => (
        <Link
          href={`/product/${product.slug}`}
          className="font-semibold text-text hover:text-primary"
        >
          {product.name}
        </Link>
      ),
    },
    {
      label: "Price",
      render: (product) => (
        <span className="font-bold">{formatPrice(product.price)}</span>
      ),
    },
    {
      label: "Brand",
      render: (product) => product.brand,
    },
    {
      label: "Category",
      render: (product) =>
        categories.find((category) => category.slug === product.categorySlug)
          ?.name ?? product.categorySlug,
    },
    {
      label: "Rating",
      render: (product) => (
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      ),
    },
    {
      label: "Seller",
      render: (product) => {
        const seller = getSellerById(product.sellerId);
        return seller ? (
          <Link
            href={`/seller/${seller.slug}`}
            className="font-medium text-primary hover:underline"
          >
            {seller.name}
          </Link>
        ) : (
          "—"
        );
      },
    },
    {
      label: "Availability",
      render: (product) =>
        product.stock > 0 ? `${product.stock} in stock` : "Out of stock",
    },
    {
      label: "Key specs",
      render: (product) => (
        <ul className="space-y-1 text-left text-xs text-muted">
          {product.specs.slice(0, 4).map((spec) => (
            <li key={spec.label}>
              <span className="font-medium text-text">{spec.label}:</span>{" "}
              {spec.value}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text">
            Compare products
          </h1>
          <p className="mt-2 text-sm text-muted">
            Comparing {products.length} of 3 products. Selections persist in
            localStorage.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={clearCompare}>
          Clear all
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
        <table className="min-w-[720px] w-full text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-0">
                <th className="w-36 bg-slate-50 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  {row.label}
                </th>
                {products.map((product) => (
                  <td
                    key={`${row.label}-${product.id}`}
                    className="px-4 py-4 align-top text-center"
                  >
                    {row.render(product)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th className="bg-slate-50 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                Actions
              </th>
              {products.map((product) => (
                <td key={`actions-${product.id}`} className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={product.stock <= 0}
                      onClick={() => {
                        const result = addToCart(product.id);
                        if (!result.ok) {
                          notify({ title: result.message, tone: "error" });
                        }
                      }}
                    >
                      Add to cart
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCompare(product.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
