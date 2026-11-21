import {
  categories,
  getCategoryBySlug,
  getSellerById,
  products,
} from "./data";
import type { CatalogFilters, Product, SortOption } from "./types";

export const PAGE_SIZE = 12;

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "bestselling", label: "Best Selling" },
];

export const PRICE_BOUNDS = {
  min: 0,
  max: Math.ceil(Math.max(...products.map((product) => product.price)) / 10) * 10,
};

export function getDefaultFilters(
  overrides: Partial<CatalogFilters> = {},
): CatalogFilters {
  return {
    q: "",
    categories: [],
    brands: [],
    minPrice: null,
    maxPrice: null,
    minRating: null,
    inStock: false,
    onSale: false,
    sort: "featured",
    page: 1,
    view: "grid",
    ...overrides,
  };
}

export function parseCatalogParams(
  params: Record<string, string | string[] | undefined>,
  defaults: Partial<CatalogFilters> = {},
): CatalogFilters {
  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const parseList = (value?: string) =>
    value
      ? value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const minPriceRaw = get("minPrice");
  const maxPriceRaw = get("maxPrice");
  const minRatingRaw = get("minRating");
  const pageRaw = get("page");
  const sortRaw = get("sort") as SortOption | undefined;
  const viewRaw = get("view");

  const validSort = SORT_OPTIONS.some((option) => option.value === sortRaw)
    ? sortRaw!
    : defaults.sort ?? "featured";

  return getDefaultFilters({
    ...defaults,
    q: (get("q") ?? defaults.q ?? "").trim(),
    categories:
      parseList(get("category")).length > 0
        ? parseList(get("category"))
        : (defaults.categories ?? []),
    brands: parseList(get("brand")),
    minPrice:
      minPriceRaw && !Number.isNaN(Number(minPriceRaw))
        ? Number(minPriceRaw)
        : null,
    maxPrice:
      maxPriceRaw && !Number.isNaN(Number(maxPriceRaw))
        ? Number(maxPriceRaw)
        : null,
    minRating:
      minRatingRaw && !Number.isNaN(Number(minRatingRaw))
        ? Number(minRatingRaw)
        : null,
    inStock: get("inStock") === "1" || get("inStock") === "true",
    onSale: get("onSale") === "1" || get("onSale") === "true",
    sort: validSort,
    page: Math.max(1, Number(pageRaw) || 1),
    view: viewRaw === "list" ? "list" : "grid",
  });
}

export function catalogFiltersToParams(
  filters: CatalogFilters,
  locked: Partial<CatalogFilters> = {},
): URLSearchParams {
  const params = new URLSearchParams();
  const effective = { ...filters, ...locked };

  if (effective.q) params.set("q", effective.q);
  if (!locked.categories && effective.categories.length > 0) {
    params.set("category", effective.categories.join(","));
  }
  if (effective.brands.length > 0) {
    params.set("brand", effective.brands.join(","));
  }
  if (effective.minPrice !== null) {
    params.set("minPrice", String(effective.minPrice));
  }
  if (effective.maxPrice !== null) {
    params.set("maxPrice", String(effective.maxPrice));
  }
  if (effective.minRating !== null) {
    params.set("minRating", String(effective.minRating));
  }
  if (effective.inStock) params.set("inStock", "1");
  if (effective.onSale) params.set("onSale", "1");
  if (effective.sort !== "featured") params.set("sort", effective.sort);
  if (effective.page > 1) params.set("page", String(effective.page));
  if (effective.view === "list") params.set("view", "list");

  return params;
}

export function productMatchesQuery(product: Product, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const seller = getSellerById(product.sellerId);
  const category = getCategoryBySlug(product.categorySlug);

  return [
    product.name,
    product.description,
    product.longDescription,
    product.brand,
    category?.name,
    seller?.name,
    ...(product.colors ?? []),
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(q));
}

export function filterProducts(
  source: Product[],
  filters: CatalogFilters,
): Product[] {
  return source.filter((product) => {
    if (!productMatchesQuery(product, filters.q)) return false;

    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.categorySlug)
    ) {
      return false;
    }

    if (
      filters.brands.length > 0 &&
      !filters.brands.includes(product.brand)
    ) {
      return false;
    }

    if (filters.minPrice !== null && product.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice !== null && product.price > filters.maxPrice) {
      return false;
    }

    if (filters.minRating !== null && product.rating < filters.minRating) {
      return false;
    }

    if (filters.inStock && product.stock <= 0) return false;

    if (filters.onSale && !(product.originalPrice && product.originalPrice > product.price)) {
      return false;
    }

    return true;
  });
}

export function sortProducts(source: Product[], sort: SortOption): Product[] {
  const items = [...source];

  switch (sort) {
    case "newest":
      return items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "price-asc":
      return items.sort((a, b) => a.price - b.price);
    case "price-desc":
      return items.sort((a, b) => b.price - a.price);
    case "rating":
      return items.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "bestselling":
      return items.sort((a, b) => b.salesCount - a.salesCount);
    case "featured":
    default:
      return items.sort((a, b) => {
        const score = (product: Product) =>
          (product.isFeatured ? 4 : 0) +
          (product.isBestSeller ? 2 : 0) +
          (product.isTrending ? 1 : 0) +
          product.rating;
        return score(b) - score(a) || b.salesCount - a.salesCount;
      });
  }
}

export function paginateProducts(source: Product[], page: number, pageSize = PAGE_SIZE) {
  const total = source.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: source.slice(start, start + pageSize),
    total,
    totalPages,
    currentPage,
    pageSize,
  };
}

export function queryCatalog(
  filters: CatalogFilters,
  source: Product[] = products,
) {
  const filtered = filterProducts(source, filters);
  const sorted = sortProducts(filtered, filters.sort);
  const page = paginateProducts(sorted, filters.page);

  return {
    ...page,
    allFiltered: sorted,
  };
}

export function getAvailableBrands(source: Product[] = products) {
  return Array.from(new Set(source.map((product) => product.brand))).sort();
}

export function getActiveFilterChips(filters: CatalogFilters) {
  const chips: { key: string; label: string; clear: Partial<CatalogFilters> }[] =
    [];

  if (filters.q) {
    chips.push({
      key: "q",
      label: `Search: “${filters.q}”`,
      clear: { q: "", page: 1 },
    });
  }

  filters.categories.forEach((slug) => {
    const category = categories.find((item) => item.slug === slug);
    chips.push({
      key: `category-${slug}`,
      label: category?.name ?? slug,
      clear: {
        categories: filters.categories.filter((item) => item !== slug),
        page: 1,
      },
    });
  });

  filters.brands.forEach((brand) => {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      clear: {
        brands: filters.brands.filter((item) => item !== brand),
        page: 1,
      },
    });
  });

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const min = filters.minPrice ?? PRICE_BOUNDS.min;
    const max = filters.maxPrice ?? PRICE_BOUNDS.max;
    chips.push({
      key: "price",
      label: `$${min} – $${max}`,
      clear: { minPrice: null, maxPrice: null, page: 1 },
    });
  }

  if (filters.minRating !== null) {
    chips.push({
      key: "rating",
      label: `${filters.minRating}+ stars`,
      clear: { minRating: null, page: 1 },
    });
  }

  if (filters.inStock) {
    chips.push({
      key: "inStock",
      label: "In stock",
      clear: { inStock: false, page: 1 },
    });
  }

  if (filters.onSale) {
    chips.push({
      key: "onSale",
      label: "On sale",
      clear: { onSale: false, page: 1 },
    });
  }

  return chips;
}

export function countActiveFilters(filters: CatalogFilters, lockedCategories = false) {
  let count = 0;
  if (filters.q) count += 1;
  if (!lockedCategories) count += filters.categories.length;
  count += filters.brands.length;
  if (filters.minPrice !== null || filters.maxPrice !== null) count += 1;
  if (filters.minRating !== null) count += 1;
  if (filters.inStock) count += 1;
  if (filters.onSale) count += 1;
  return count;
}
