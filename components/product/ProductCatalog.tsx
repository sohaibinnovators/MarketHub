"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CatalogFiltersPanel } from "@/components/product/CatalogFilters";
import { ProductGrid } from "@/components/product/ProductCard";
import { ProductListItem } from "@/components/product/ProductListItem";
import { Button } from "@/components/ui/Button";
import {
  PAGE_SIZE,
  SORT_OPTIONS,
  catalogFiltersToParams,
  countActiveFilters,
  getActiveFilterChips,
  getDefaultFilters,
  parseCatalogParams,
  queryCatalog,
} from "@/lib/catalog";
import type { CatalogFilters, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  products: Product[];
  title?: string;
  subtitle?: string;
  lockedCategory?: string;
  basePath?: string;
  hideCategoryFilter?: boolean;
};

export function ProductCatalog({
  products,
  title,
  subtitle,
  lockedCategory,
  basePath,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, startTransition] = useTransition();

  const lockedDefaults = useMemo(
    () =>
      lockedCategory
        ? { categories: [lockedCategory] }
        : ({} as Partial<CatalogFilters>),
    [lockedCategory],
  );

  const filters = useMemo(() => {
    const parsed = parseCatalogParams(
      Object.fromEntries(searchParams.entries()),
      lockedDefaults,
    );
    if (lockedCategory) {
      parsed.categories = [lockedCategory];
    }
    return parsed;
  }, [searchParams, lockedDefaults, lockedCategory]);

  const result = useMemo(
    () => queryCatalog(filters, products),
    [filters, products],
  );

  const chips = useMemo(() => {
    const all = getActiveFilterChips(filters);
    if (lockedCategory) {
      return all.filter((chip) => !chip.key.startsWith("category-"));
    }
    return all;
  }, [filters, lockedCategory]);

  const activeCount = countActiveFilters(filters, Boolean(lockedCategory));

  const pushFilters = useCallback(
    (next: CatalogFilters) => {
      const locked = lockedCategory
        ? { categories: [lockedCategory] as string[] }
        : {};
      const params = catalogFiltersToParams({ ...next, ...locked }, locked);
      const query = params.toString();
      const target = `${basePath ?? pathname}${query ? `?${query}` : ""}`;
      startTransition(() => {
        router.replace(target, { scroll: false });
      });
    },
    [basePath, lockedCategory, pathname, router],
  );

  const updateFilters = (patch: Partial<CatalogFilters>) => {
    pushFilters({ ...filters, ...patch });
  };

  const clearFilters = () => {
    pushFilters(
      getDefaultFilters({
        ...(lockedCategory ? { categories: [lockedCategory] } : {}),
        sort: filters.sort,
        view: filters.view,
      }),
    );
  };

  useEffect(() => {
    if (result.currentPage !== filters.page && result.total > 0) {
      pushFilters({ ...filters, page: result.currentPage });
    }
  }, [filters, pushFilters, result.currentPage, result.total]);

  return (
    <div>
      {(title || subtitle) && (
        <div className="mb-8">
          {title ? (
            <h1 className="font-display text-3xl font-semibold tracking-tight text-text md:text-4xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Showing{" "}
          <span className="font-semibold text-text">{result.items.length}</span>{" "}
          of <span className="font-semibold text-text">{result.total}</span>{" "}
          products
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
          >
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </Button>
          <label className="flex items-center gap-2 text-sm text-muted">
            <span className="sr-only">Sort by</span>
            <select
              value={filters.sort}
              onChange={(event) =>
                updateFilters({
                  sort: event.target.value as CatalogFilters["sort"],
                  page: 1,
                })
              }
              className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="inline-flex overflow-hidden rounded-xl border border-border">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={filters.view === "grid"}
              onClick={() => updateFilters({ view: "grid" })}
              className={cn(
                "h-10 px-3 text-sm font-medium",
                filters.view === "grid"
                  ? "bg-primary text-white"
                  : "bg-surface text-muted hover:text-text",
              )}
            >
              Grid
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={filters.view === "list"}
              onClick={() => updateFilters({ view: "list" })}
              className={cn(
                "h-10 px-3 text-sm font-medium",
                filters.view === "list"
                  ? "bg-primary text-white"
                  : "bg-surface text-muted hover:text-text",
              )}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => updateFilters(chip.clear)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text hover:border-primary hover:text-primary"
            >
              {chip.label}
              <span aria-hidden>×</span>
            </button>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Clear all
          </button>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <CatalogFiltersPanel
              filters={filters}
              source={products}
              lockedCategory={lockedCategory}
              onChange={updateFilters}
              onClear={clearFilters}
            />
          </div>
        </div>

        <div>
          {result.total === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
              <p className="text-lg font-semibold text-text">No products found</p>
              <p className="mt-2 text-sm text-muted">
                Try adjusting your search or clearing filters.
              </p>
              <Button className="mt-6" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : filters.view === "list" ? (
            <div className="space-y-4">
              {result.items.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <ProductGrid products={result.items} />
          )}

          {result.totalPages > 1 ? (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={result.currentPage <= 1}
                onClick={() =>
                  updateFilters({ page: Math.max(1, result.currentPage - 1) })
                }
              >
                Previous
              </Button>
              {Array.from({ length: result.totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => updateFilters({ page })}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold",
                      page === result.currentPage
                        ? "bg-primary text-white"
                        : "border border-border bg-surface text-text hover:border-primary",
                    )}
                    aria-current={
                      page === result.currentPage ? "page" : undefined
                    }
                  >
                    {page}
                  </button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={result.currentPage >= result.totalPages}
                onClick={() =>
                  updateFilters({
                    page: Math.min(result.totalPages, result.currentPage + 1),
                  })
                }
              >
                Next
              </Button>
              <p className="w-full text-center text-xs text-muted">
                Page {result.currentPage} of {result.totalPages} · {PAGE_SIZE}{" "}
                per page
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#172033]/45"
            aria-label="Close filters"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,22rem)] flex-col bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="font-semibold text-text">Filters</p>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <CatalogFiltersPanel
                filters={filters}
                source={products}
                lockedCategory={lockedCategory}
                onChange={updateFilters}
                onClear={clearFilters}
              />
            </div>
            <div className="border-t border-border p-4">
              <Button className="w-full" onClick={() => setMobileOpen(false)}>
                Show {result.total} products
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
