"use client";

import { categories } from "@/lib/data";
import {
  PRICE_BOUNDS,
  countActiveFilters,
  getAvailableBrands,
} from "@/lib/catalog";
import type { CatalogFilters as Filters, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  filters: Filters;
  source: Product[];
  lockedCategory?: string;
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
  className?: string;
};

export function CatalogFiltersPanel({
  filters,
  source,
  lockedCategory,
  onChange,
  onClear,
  className,
}: Props) {
  const brands = getAvailableBrands(source);
  const activeCount = countActiveFilters(filters, Boolean(lockedCategory));

  const toggleCategory = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((item) => item !== slug)
      : [...filters.categories, slug];
    onChange({ categories: next, page: 1 });
  };

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((item) => item !== brand)
      : [...filters.brands, brand];
    onChange({ brands: next, page: 1 });
  };

  return (
    <aside className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-text">Filters</h2>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-text">Search products</span>
        <input
          type="search"
          value={filters.q}
          onChange={(event) =>
            onChange({ q: event.target.value, page: 1 })
          }
          placeholder="Name, brand, description..."
          className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      {!lockedCategory ? (
        <fieldset>
          <legend className="text-sm font-medium text-text">Category</legend>
          <div className="mt-3 space-y-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center gap-2 text-sm text-text"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.slug)}
                  onChange={() => toggleCategory(category.slug)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="flex-1">{category.name}</span>
                <span className="text-xs text-muted">{category.productCount}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="text-sm font-medium text-text">Brand</legend>
        <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex cursor-pointer items-center gap-2 text-sm text-text"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              {brand}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-text">Price range</legend>
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1 text-xs text-muted">
            Min
            <input
              type="number"
              min={PRICE_BOUNDS.min}
              max={PRICE_BOUNDS.max}
              value={filters.minPrice ?? ""}
              placeholder={String(PRICE_BOUNDS.min)}
              onChange={(event) =>
                onChange({
                  minPrice: event.target.value
                    ? Number(event.target.value)
                    : null,
                  page: 1,
                })
              }
              className="h-10 w-full rounded-xl border border-border px-3 text-sm text-text outline-none focus:border-primary"
            />
          </label>
          <label className="space-y-1 text-xs text-muted">
            Max
            <input
              type="number"
              min={PRICE_BOUNDS.min}
              max={PRICE_BOUNDS.max}
              value={filters.maxPrice ?? ""}
              placeholder={String(PRICE_BOUNDS.max)}
              onChange={(event) =>
                onChange({
                  maxPrice: event.target.value
                    ? Number(event.target.value)
                    : null,
                  page: 1,
                })
              }
              className="h-10 w-full rounded-xl border border-border px-3 text-sm text-text outline-none focus:border-primary"
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-text">Minimum rating</legend>
        <div className="mt-3 space-y-2">
          {[4.5, 4, 3.5, 3].map((rating) => (
            <label
              key={rating}
              className="flex cursor-pointer items-center gap-2 text-sm text-text"
            >
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === rating}
                onChange={() => onChange({ minRating: rating, page: 1 })}
                className="border-border text-primary focus:ring-primary"
              />
              {rating}+ stars
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-2 text-sm text-text">
            <input
              type="radio"
              name="minRating"
              checked={filters.minRating === null}
              onChange={() => onChange({ minRating: null, page: 1 })}
              className="border-border text-primary focus:ring-primary"
            />
            Any rating
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-text">Availability</legend>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(event) =>
              onChange({ inStock: event.target.checked, page: 1 })
            }
            className="rounded border-border text-primary focus:ring-primary"
          />
          In stock only
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={(event) =>
              onChange({ onSale: event.target.checked, page: 1 })
            }
            className="rounded border-border text-primary focus:ring-primary"
          />
          On sale / discounted
        </label>
      </fieldset>
    </aside>
  );
}
