"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { categories, formatPrice } from "@/lib/data";
import { useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";

const PAGE_SIZE = 8;

export function SellerProductsManager() {
  const { ready, sellerProducts, deleteProduct } = useMarketplace();
  const { notify, purgeProductReferences } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...sellerProducts];
    const q = query.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q),
      );
    }
    if (category !== "all") {
      items = items.filter((product) => product.categorySlug === category);
    }
    switch (sort) {
      case "price-asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items.sort((a, b) => b.price - a.price);
        break;
      case "stock":
        items.sort((a, b) => b.stock - a.stock);
        break;
      default:
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
    return items;
  }, [sellerProducts, query, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text">
            My products
          </h1>
          <p className="mt-2 text-sm text-muted">
            Manage listings, stock, and visibility for your store.
          </p>
        </div>
        <Button href="/seller-dashboard/products/add">Add product</Button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm md:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          className="h-11 flex-1 rounded-xl border border-border px-3 text-sm outline-none focus:border-primary"
        />
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
          className="h-11 rounded-xl border border-border px-3 text-sm"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="h-11 rounded-xl border border-border px-3 text-sm"
          aria-label="Sort products"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="stock">Stock</option>
        </select>
      </div>

      {pageItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold">No products found</p>
          <p className="mt-2 text-sm text-muted">
            Try adjusting filters or add your first listing.
          </p>
          <Button href="/seller-dashboard/products/add" className="mt-6">
            Add product
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-slate-50 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            unoptimized={product.image.startsWith("data:")}
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-text">{product.name}</p>
                          <p className="text-xs text-muted">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {product.categorySlug.replace(/-/g, " ")}
                    </td>
                    <td className="px-4 py-3">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {product.listingStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/seller-dashboard/products/edit/${product.id}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        {confirmId === product.id ? (
                          <>
                            <button
                              type="button"
                              className="font-semibold text-danger hover:underline"
                              onClick={() => {
                                const result = deleteProduct(product.id);
                                if (result.ok) {
                                  purgeProductReferences(product.id);
                                  notify({
                                    title: "Product deleted",
                                    description: product.name,
                                    tone: "info",
                                  });
                                } else {
                                  notify({
                                    title: result.message,
                                    tone: "error",
                                  });
                                }
                                setConfirmId(null);
                              }}
                            >
                              Confirm delete
                            </button>
                            <button
                              type="button"
                              className="text-muted hover:underline"
                              onClick={() => setConfirmId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="font-semibold text-danger hover:underline"
                            onClick={() => setConfirmId(product.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() =>
              setPage((value) => Math.min(totalPages, value + 1))
            }
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
