"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  getRatingOverrides,
  setLiveCatalog,
  subscribeLiveCatalog,
} from "./catalog-registry";
import { sellers as baseSellers, productCatalogSeed } from "./data";
import { useIsClient } from "./use-is-client";
import type {
  Product,
  ProductInput,
  Seller,
  SellerActivity,
  SellerListingStatus,
  SellerProductRecord,
  SellerStoreProfile,
} from "./types";

export const DEMO_SELLER_ID = "seller-1";

const STORAGE_KEY = "markethub-marketplace-v4";

type MarketplaceState = {
  createdProducts: SellerProductRecord[];
  updatedProducts: Record<string, SellerProductRecord>;
  deletedProductIds: string[];
  listingStatus: Record<string, SellerListingStatus>;
  storeProfile: SellerStoreProfile | null;
  activity: SellerActivity[];
};

type MarketplaceContextValue = {
  ready: boolean;
  demoSellerId: string;
  products: Product[];
  sellers: Seller[];
  demoSeller: Seller;
  storeProfile: SellerStoreProfile;
  sellerProducts: SellerProductRecord[];
  activity: SellerActivity[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getSellerById: (id: string) => Seller | undefined;
  getSellerBySlug: (slug: string) => Seller | undefined;
  getProductsBySeller: (sellerId: string) => Product[];
  getProductsByCategory: (slug: string) => Product[];
  addProduct: (
    input: ProductInput,
  ) => { ok: boolean; product?: SellerProductRecord; message: string };
  updateProduct: (
    id: string,
    input: ProductInput,
  ) => { ok: boolean; product?: SellerProductRecord; message: string };
  deleteProduct: (id: string) => { ok: boolean; message: string };
  updateStoreProfile: (
    profile: SellerStoreProfile,
  ) => { ok: boolean; message: string };
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function defaultProfile(seller: Seller): SellerStoreProfile {
  return {
    name: seller.name,
    tagline: seller.tagline,
    description: seller.description,
    logo: seller.logo,
    coverImage: seller.coverImage,
    email: "sellers@novatech.demo",
    phone: "+1 (512) 555-0142",
    location: seller.location,
  };
}

function toSellerRecord(
  product: Product,
  listingStatus: SellerListingStatus,
): SellerProductRecord {
  return { ...product, listingStatus };
}

function buildVariants(colors?: string[], sizes?: string[]) {
  const variants = [];
  if (colors && colors.length > 0) {
    variants.push({ name: "Color", options: colors });
  }
  if (sizes && sizes.length > 0) {
    variants.push({ name: "Size", options: sizes });
  }
  return variants.length > 0 ? variants : undefined;
}

function fromInput(
  input: ProductInput,
  base: Partial<Product> & { id: string; slug: string; sellerId: string },
): SellerProductRecord {
  const stock =
    input.listingStatus === "Out of Stock" ? 0 : Math.max(0, input.stock);
  const images =
    input.images && input.images.length > 0
      ? input.images
      : [input.image, input.image, input.image];

  return {
    id: base.id,
    slug: base.slug,
    sellerId: base.sellerId,
    name: input.name.trim(),
    description: input.description.trim(),
    longDescription:
      input.longDescription?.trim() || input.description.trim(),
    categorySlug: input.categorySlug,
    brand: input.brand.trim(),
    price: input.price,
    originalPrice:
      input.originalPrice && input.originalPrice > input.price
        ? input.originalPrice
        : undefined,
    stock,
    image: input.image,
    images,
    colors: input.colors?.length ? input.colors : undefined,
    variants: buildVariants(input.colors, input.sizes),
    rating: base.rating ?? 4.5,
    reviewCount: base.reviewCount ?? 0,
    salesCount: base.salesCount ?? 0,
    createdAt: base.createdAt ?? new Date().toISOString().slice(0, 10),
    badges: input.isFeatured
      ? [...(base.badges ?? []).filter((b) => b !== "New"), "New" as const].slice(
          0,
          2,
        )
      : base.badges ?? (base.id.startsWith("sp-") ? ["New"] : []),
    features: input.features?.length
      ? input.features
      : base.features ?? ["Seller-managed listing"],
    specs: base.specs ?? [
      { label: "Brand", value: input.brand },
      { label: "Category", value: input.categorySlug },
    ],
    isFeatured: Boolean(input.isFeatured),
    isNew: base.isNew ?? true,
    isTrending: base.isTrending,
    isBestSeller: base.isBestSeller,
    listingStatus: input.listingStatus,
  };
}

function emptyState(): MarketplaceState {
  return {
    createdProducts: [],
    updatedProducts: {},
    deletedProductIds: [],
    listingStatus: {},
    storeProfile: null,
    activity: [],
  };
}

function computeLiveProducts(state: MarketplaceState): Product[] {
  const base = productCatalogSeed
    .filter((product) => !state.deletedProductIds.includes(product.id))
    .map((product) => {
      const updated = state.updatedProducts[product.id];
      if (updated) {
        if (updated.listingStatus === "Draft") return null;
        const { listingStatus: _, ...rest } = updated;
        void _;
        return rest;
      }
      const status = state.listingStatus[product.id];
      if (status === "Draft") return null;
      if (status === "Out of Stock") return { ...product, stock: 0 };
      return product;
    })
    .filter(Boolean) as Product[];

  const created = state.createdProducts
    .filter(
      (product) =>
        !state.deletedProductIds.includes(product.id) &&
        product.listingStatus !== "Draft",
    )
    .map((product) => {
      const { listingStatus: _, ...rest } = product;
      void _;
      return rest;
    });

  return [...base, ...created];
}

function computeSellerProducts(
  state: MarketplaceState,
  sellerId: string,
): SellerProductRecord[] {
  const fromBase = productCatalogSeed
    .filter(
      (product) =>
        product.sellerId === sellerId &&
        !state.deletedProductIds.includes(product.id),
    )
    .map((product) => {
      if (state.updatedProducts[product.id]) {
        return state.updatedProducts[product.id];
      }
      const status =
        state.listingStatus[product.id] ??
        (product.stock <= 0 ? "Out of Stock" : "Active");
      return toSellerRecord(
        status === "Out of Stock" ? { ...product, stock: 0 } : product,
        status,
      );
    });

  const created = state.createdProducts.filter(
    (product) =>
      product.sellerId === sellerId &&
      !state.deletedProductIds.includes(product.id),
  );

  return [...created, ...fromBase].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function computeSellers(
  state: MarketplaceState,
  products: Product[],
): Seller[] {
  return baseSellers.map((seller) => {
    const count = products.filter((product) => product.sellerId === seller.id)
      .length;
    if (seller.id !== DEMO_SELLER_ID || !state.storeProfile) {
      return { ...seller, productCount: count };
    }
    const profile = state.storeProfile;
    return {
      ...seller,
      name: profile.name,
      tagline: profile.tagline,
      description: profile.description,
      logo: profile.logo,
      coverImage: profile.coverImage,
      location: profile.location,
      productCount: count,
    };
  });
}

function withRatings(products: Product[]) {
  const overrides = getRatingOverrides();
  return products.map((product) => {
    const override = overrides[product.id];
    return override ? { ...product, ...override } : product;
  });
}

function readMarketplaceState(): MarketplaceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as MarketplaceState;
    return {
      ...emptyState(),
      ...parsed,
      createdProducts: Array.isArray(parsed.createdProducts)
        ? parsed.createdProducts
        : [],
      updatedProducts: parsed.updatedProducts ?? {},
      deletedProductIds: Array.isArray(parsed.deletedProductIds)
        ? parsed.deletedProductIds
        : [],
      listingStatus: parsed.listingStatus ?? {},
      activity: Array.isArray(parsed.activity) ? parsed.activity : [],
    };
  } catch {
    return emptyState();
  }
}

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  const [state, setState] = useState<MarketplaceState>(emptyState);
  const [ready, setReady] = useState(false);
  const ratingEpoch = useSyncExternalStore(
    subscribeLiveCatalog,
    () => JSON.stringify(getRatingOverrides()),
    () => "",
  );

  if (isClient && !ready) {
    setState(readMarketplaceState());
    setReady(true);
  }

  useEffect(() => {
    const onReset = () => setState(emptyState());
    window.addEventListener("markethub:demo-reset", onReset);
    return () => window.removeEventListener("markethub:demo-reset", onReset);
  }, []);

  const products = useMemo(() => {
    void ratingEpoch;
    return withRatings(computeLiveProducts(state));
  }, [state, ratingEpoch]);
  const sellers = useMemo(
    () => computeSellers(state, products),
    [state, products],
  );
  const demoSeller =
    sellers.find((seller) => seller.id === DEMO_SELLER_ID) ?? baseSellers[0];
  const storeProfile = state.storeProfile ?? defaultProfile(demoSeller);
  const sellerProducts = useMemo(
    () => computeSellerProducts(state, DEMO_SELLER_ID),
    [state],
  );

  useEffect(() => {
    if (!ready) return;
    setLiveCatalog(products, sellers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [products, sellers, state, ready]);

  const pushActivity = useCallback(
    (type: SellerActivity["type"], message: string) => {
      const entry: SellerActivity = {
        id: `act-${Date.now()}`,
        type,
        message,
        at: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        activity: [entry, ...prev.activity].slice(0, 40),
      }));
    },
    [],
  );

  const addProduct = useCallback(
    (input: ProductInput) => {
      const id = `sp-${Date.now()}`;
      let slug = slugify(input.name) || id;
      const existingSlugs = new Set([
        ...productCatalogSeed.map((product) => product.slug),
        ...Object.values(state.updatedProducts).map((product) => product.slug),
        ...state.createdProducts.map((product) => product.slug),
      ]);
      if (existingSlugs.has(slug)) slug = `${slug}-${Date.now().toString(36)}`;

      const product = fromInput(input, {
        id,
        slug,
        sellerId: DEMO_SELLER_ID,
        rating: 4.5,
        reviewCount: 0,
        salesCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        badges: ["New"],
        isNew: true,
      });

      setState((prev) => ({
        ...prev,
        createdProducts: [product, ...prev.createdProducts],
      }));
      pushActivity("product_added", `Added product “${product.name}”`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("markethub:seller-update", {
            detail: {
              message: `NovaTech Labs added “${product.name}” to the demo catalog.`,
              href: `/product/${product.slug}`,
            },
          }),
        );
      }
      return { ok: true, product, message: "Product added" };
    },
    [pushActivity, state.createdProducts, state.updatedProducts],
  );

  const updateProduct = useCallback(
    (id: string, input: ProductInput) => {
      const current =
        state.createdProducts.find((product) => product.id === id) ??
        state.updatedProducts[id] ??
        productCatalogSeed.find((product) => product.id === id);

      if (!current || current.sellerId !== DEMO_SELLER_ID) {
        return { ok: false, message: "Product not found for this seller." };
      }
      if (state.deletedProductIds.includes(id)) {
        return { ok: false, message: "Product was deleted." };
      }

      const product = fromInput(input, {
        ...current,
        id: current.id,
        slug: current.slug,
        sellerId: DEMO_SELLER_ID,
      });

      setState((prev) => {
        const createdIndex = prev.createdProducts.findIndex(
          (item) => item.id === id,
        );
        if (createdIndex >= 0) {
          const createdProducts = [...prev.createdProducts];
          createdProducts[createdIndex] = product;
          return { ...prev, createdProducts };
        }
        return {
          ...prev,
          updatedProducts: { ...prev.updatedProducts, [id]: product },
          listingStatus: {
            ...prev.listingStatus,
            [id]: product.listingStatus,
          },
        };
      });
      pushActivity("product_updated", `Updated product “${product.name}”`);
      if (typeof window !== "undefined") {
        const previousStock = Number(current.stock) || 0;
        const becameOut =
          product.listingStatus === "Out of Stock" || product.stock <= 0;
        const wasOut = previousStock <= 0;
        if (becameOut !== wasOut) {
          window.dispatchEvent(
            new CustomEvent("markethub:availability", {
              detail: {
                productId: product.id,
                name: product.name,
                inStock: !becameOut,
              },
            }),
          );
        }
        window.dispatchEvent(
          new CustomEvent("markethub:seller-update", {
            detail: {
              message: `A seller updated “${product.name}” in the demo catalog.`,
              href: `/product/${product.slug}`,
            },
          }),
        );
      }
      return { ok: true, product, message: "Product updated" };
    },
    [pushActivity, state],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const current =
        state.createdProducts.find((product) => product.id === id) ??
        state.updatedProducts[id] ??
        productCatalogSeed.find((product) => product.id === id);
      if (!current || current.sellerId !== DEMO_SELLER_ID) {
        return { ok: false, message: "Product not found for this seller." };
      }

      setState((prev) => ({
        ...prev,
        deletedProductIds: Array.from(
          new Set([...prev.deletedProductIds, id]),
        ),
        createdProducts: prev.createdProducts.filter(
          (product) => product.id !== id,
        ),
        updatedProducts: Object.fromEntries(
          Object.entries(prev.updatedProducts).filter(([key]) => key !== id),
        ),
      }));
      pushActivity(
        "product_deleted",
        `Deleted product “${current.name}”`,
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("markethub:product-deleted", { detail: { id } }),
        );
      }
      return { ok: true, message: "Product deleted" };
    },
    [pushActivity, state],
  );

  const updateStoreProfile = useCallback(
    (profile: SellerStoreProfile) => {
      if (profile.name.trim().length < 2) {
        return { ok: false, message: "Enter a store name." };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
        return { ok: false, message: "Enter a valid contact email." };
      }
      setState((prev) => ({ ...prev, storeProfile: profile }));
      pushActivity("store_updated", "Updated store profile");
      return { ok: true, message: "Store profile saved" };
    },
    [pushActivity],
  );

  const value = useMemo<MarketplaceContextValue>(
    () => ({
      ready,
      demoSellerId: DEMO_SELLER_ID,
      products,
      sellers,
      demoSeller,
      storeProfile,
      sellerProducts,
      activity: state.activity,
      getProductBySlug: (slug) =>
        products.find((product) => product.slug === slug),
      getProductById: (id) => products.find((product) => product.id === id),
      getSellerById: (id) => sellers.find((seller) => seller.id === id),
      getSellerBySlug: (slug) =>
        sellers.find((seller) => seller.slug === slug),
      getProductsBySeller: (sellerId) =>
        products.filter((product) => product.sellerId === sellerId),
      getProductsByCategory: (slug) =>
        products.filter((product) => product.categorySlug === slug),
      addProduct,
      updateProduct,
      deleteProduct,
      updateStoreProfile,
    }),
    [
      ready,
      products,
      sellers,
      demoSeller,
      storeProfile,
      sellerProducts,
      state.activity,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStoreProfile,
    ],
  );

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within MarketplaceProvider");
  }
  return context;
}
