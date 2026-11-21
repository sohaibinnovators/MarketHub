export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private mode — ignore for demo persistence.
  }
}

export function removeKeys(keys: string[]) {
  if (typeof window === "undefined") return;
  keys.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
}

/** Known MarketHub demo persistence keys across phases. */
export const MARKET_HUB_STORAGE_KEYS = [
  "markethub-cart-v3",
  "markethub-wishlist-v3",
  "markethub-orders-v3",
  "markethub-last-order-v3",
  "markethub-marketplace-v4",
  "markethub-seller-settings-v4",
  "markethub-experience-v5",
  "markethub-cart",
  "markethub-wishlist",
] as const;
