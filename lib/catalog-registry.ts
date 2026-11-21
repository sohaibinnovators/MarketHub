import { sellers as seedSellers } from "./data";
import { productCatalog } from "./products-data";
import type { Product, Seller } from "./types";

let liveProducts: Product[] = [...productCatalog];
let liveSellers: Seller[] = [...seedSellers];
let ratingOverrides: Record<string, { rating: number; reviewCount: number }> =
  {};
const listeners = new Set<() => void>();

function applyRatingOverrides(products: Product[]) {
  return products.map((product) => {
    const override = ratingOverrides[product.id];
    return override ? { ...product, ...override } : product;
  });
}

export function getLiveProducts() {
  return applyRatingOverrides(liveProducts);
}

export function getLiveSellers() {
  return liveSellers;
}

export function setLiveCatalog(products: Product[], sellers: Seller[]) {
  liveProducts = products;
  liveSellers = sellers;
  listeners.forEach((listener) => listener());
}

export function getRatingOverrides() {
  return ratingOverrides;
}

export function setRatingOverrides(
  overrides: Record<string, { rating: number; reviewCount: number }>,
) {
  ratingOverrides = overrides;
  listeners.forEach((listener) => listener());
}

export function subscribeLiveCatalog(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
