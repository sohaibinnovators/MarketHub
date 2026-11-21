"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { reviews as seedReviews } from "./data";
import { setRatingOverrides } from "./catalog-registry";
import { MARKET_HUB_STORAGE_KEYS, readJson, removeKeys, writeJson } from "./storage";
import type {
  AppNotification,
  CustomerProfile,
  ProductReview,
  ReviewInput,
} from "./types";
import { useIsClient } from "./use-is-client";

export const DEMO_CUSTOMER_ID = "customer-1";
export const DEMO_CUSTOMER_NAME = "Alex Rivera";

const STORAGE_KEY = "markethub-experience-v5";
const MAX_RECENT = 12;
const MAX_COMPARE = 3;
const MAX_NOTIFICATIONS = 40;

type ExperienceState = {
  profile: CustomerProfile;
  userReviews: ProductReview[];
  deletedSeedReviewIds: string[];
  recentlyViewed: string[];
  compareIds: string[];
  notifications: AppNotification[];
};

type ExperienceContextValue = {
  ready: boolean;
  demoCustomerId: string;
  profile: CustomerProfile;
  reviews: ProductReview[];
  myReviews: ProductReview[];
  recentlyViewedIds: string[];
  compareIds: string[];
  notifications: AppNotification[];
  unreadCount: number;
  updateProfile: (
    profile: CustomerProfile,
  ) => { ok: boolean; message: string };
  getReviewsForProduct: (productId: string) => ProductReview[];
  submitReview: (
    input: ReviewInput,
  ) => { ok: boolean; message: string; review?: ProductReview };
  updateReview: (
    id: string,
    input: Omit<ReviewInput, "productId">,
  ) => { ok: boolean; message: string };
  deleteReview: (id: string) => { ok: boolean; message: string };
  trackProductView: (productId: string) => void;
  addToCompare: (
    productId: string,
  ) => { ok: boolean; message: string };
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
  pushNotification: (
    input: Omit<AppNotification, "id" | "createdAt" | "read"> & {
      read?: boolean;
    },
  ) => void;
  resetDemoData: () => { ok: boolean; message: string };
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

function defaultProfile(): CustomerProfile {
  return {
    fullName: DEMO_CUSTOMER_NAME,
    email: "alex.rivera@demo.markethub",
    phone: "+1 (512) 555-0199",
    address: "214 Market Street",
    city: "Austin",
    state: "TX",
    postal: "78701",
    country: "United States",
  };
}

function seedNotifications(): AppNotification[] {
  return [
    {
      id: "n-welcome",
      type: "system",
      title: "Welcome to MarketHub demo",
      message:
        "You are browsing as demo customer Alex Rivera. Notifications are stored locally in this browser.",
      href: "/account",
      createdAt: "2026-11-20T12:00:00.000Z",
      read: false,
    },
  ];
}

function emptyState(): ExperienceState {
  return {
    profile: defaultProfile(),
    userReviews: [],
    deletedSeedReviewIds: [],
    recentlyViewed: [],
    compareIds: [],
    notifications: seedNotifications(),
  };
}

function toSeedReview(review: (typeof seedReviews)[number]): ProductReview {
  return {
    ...review,
    createdAt: new Date(review.date).toISOString(),
    isDemoCustomer: false,
  };
}

function computeReviews(state: ExperienceState): ProductReview[] {
  const seeds = seedReviews
    .filter((review) => !state.deletedSeedReviewIds.includes(review.id))
    .map(toSeedReview);
  return [...state.userReviews, ...seeds].sort((a, b) => {
    const aTime = new Date(a.createdAt ?? a.date).getTime();
    const bTime = new Date(b.createdAt ?? b.date).getTime();
    return bTime - aTime;
  });
}

function computeRatingOverrides(reviews: ProductReview[]) {
  const byProduct = new Map<string, ProductReview[]>();
  reviews.forEach((review) => {
    const list = byProduct.get(review.productId) ?? [];
    list.push(review);
    byProduct.set(review.productId, list);
  });

  const overrides: Record<string, { rating: number; reviewCount: number }> = {};
  byProduct.forEach((list, productId) => {
    const reviewCount = list.length;
    const rating =
      Math.round(
        (list.reduce((sum, review) => sum + review.rating, 0) / reviewCount) *
          10,
      ) / 10;
    overrides[productId] = { rating, reviewCount };
  });
  return overrides;
}

function sanitizeState(raw: Partial<ExperienceState> | null): ExperienceState {
  const base = emptyState();
  if (!raw) return base;
  return {
    profile: {
      ...base.profile,
      ...(raw.profile ?? {}),
    },
    userReviews: Array.isArray(raw.userReviews) ? raw.userReviews : [],
    deletedSeedReviewIds: Array.isArray(raw.deletedSeedReviewIds)
      ? raw.deletedSeedReviewIds
      : [],
    recentlyViewed: Array.isArray(raw.recentlyViewed)
      ? raw.recentlyViewed.filter((id) => typeof id === "string")
      : [],
    compareIds: Array.isArray(raw.compareIds)
      ? raw.compareIds.filter((id) => typeof id === "string").slice(0, MAX_COMPARE)
      : [],
    notifications: Array.isArray(raw.notifications)
      ? raw.notifications
      : seedNotifications(),
  };
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  const [state, setState] = useState<ExperienceState>(emptyState);
  const [ready, setReady] = useState(false);

  if (isClient && !ready) {
    const stored = readJson<Partial<ExperienceState> | null>(STORAGE_KEY, null);
    setState(sanitizeState(stored));
    setReady(true);
  }

  const reviews = useMemo(() => computeReviews(state), [state]);

  useEffect(() => {
    if (!ready) return;
    setRatingOverrides(computeRatingOverrides(reviews));
    writeJson(STORAGE_KEY, state);
  }, [ready, reviews, state]);

  const pushNotification = useCallback(
    (
      input: Omit<AppNotification, "id" | "createdAt" | "read"> & {
        read?: boolean;
      },
    ) => {
      const entry: AppNotification = {
        id: `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        read: input.read ?? false,
        type: input.type,
        title: input.title,
        message: input.message,
        href: input.href,
      };
      setState((prev) => ({
        ...prev,
        notifications: [entry, ...prev.notifications].slice(0, MAX_NOTIFICATIONS),
      }));
    },
    [],
  );

  useEffect(() => {
    const onOrderPlaced = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string; total: number }>)
        .detail;
      if (!detail?.id) return;
      pushNotification({
        type: "order_placed",
        title: "Order placed",
        message: `Demo order ${detail.id} was created successfully.`,
        href: `/orders/${encodeURIComponent(detail.id)}`,
      });
    };
    const onOrderStatus = (event: Event) => {
      const detail = (
        event as CustomEvent<{ id: string; status: string }>
      ).detail;
      if (!detail?.id) return;
      pushNotification({
        type: "order_status",
        title: "Order status updated",
        message: `${detail.id} is now ${detail.status} (demo fulfillment).`,
        href: `/orders/${encodeURIComponent(detail.id)}`,
      });
    };
    const onAvailability = (event: Event) => {
      const detail = (
        event as CustomEvent<{ productId: string; name?: string; inStock: boolean }>
      ).detail;
      if (!detail?.productId) return;
      pushNotification({
        type: "availability",
        title: detail.inStock ? "Back in stock" : "Out of stock",
        message: detail.name
          ? `${detail.name} is now ${detail.inStock ? "available" : "out of stock"} in the demo catalog.`
          : "A watched product’s availability changed.",
        href: detail.name ? undefined : "/shop",
      });
    };
    const onSellerUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ message: string; href?: string }>)
        .detail;
      if (!detail?.message) return;
      pushNotification({
        type: "seller_update",
        title: "Seller catalog update",
        message: detail.message,
        href: detail.href ?? "/shop",
      });
    };

    const onProductDeleted = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail;
      if (!detail?.id) return;
      setState((prev) => ({
        ...prev,
        compareIds: prev.compareIds.filter((id) => id !== detail.id),
        recentlyViewed: prev.recentlyViewed.filter((id) => id !== detail.id),
      }));
    };

    window.addEventListener("markethub:order-placed", onOrderPlaced);
    window.addEventListener("markethub:order-status", onOrderStatus);
    window.addEventListener("markethub:availability", onAvailability);
    window.addEventListener("markethub:seller-update", onSellerUpdate);
    window.addEventListener("markethub:product-deleted", onProductDeleted);
    return () => {
      window.removeEventListener("markethub:order-placed", onOrderPlaced);
      window.removeEventListener("markethub:order-status", onOrderStatus);
      window.removeEventListener("markethub:availability", onAvailability);
      window.removeEventListener("markethub:seller-update", onSellerUpdate);
      window.removeEventListener("markethub:product-deleted", onProductDeleted);
    };
  }, [pushNotification]);

  const updateProfile = useCallback((profile: CustomerProfile) => {
    if (profile.fullName.trim().length < 2) {
      return { ok: false, message: "Enter your full name." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      return { ok: false, message: "Enter a valid email." };
    }
    if (profile.phone.trim().length < 7) {
      return { ok: false, message: "Enter a valid phone number." };
    }
    setState((prev) => ({ ...prev, profile: { ...profile } }));
    return { ok: true, message: "Profile saved" };
  }, []);

  const getReviewsForProduct = useCallback(
    (productId: string) =>
      reviews.filter((review) => review.productId === productId),
    [reviews],
  );

  const submitReview = useCallback(
    (input: ReviewInput) => {
      if (input.rating < 1 || input.rating > 5) {
        return { ok: false, message: "Choose a rating from 1 to 5." };
      }
      if (input.title.trim().length < 3) {
        return { ok: false, message: "Enter a short review title." };
      }
      if (input.comment.trim().length < 20) {
        return { ok: false, message: "Write at least 20 characters." };
      }

      const existing = state.userReviews.find(
        (review) =>
          review.productId === input.productId && review.isDemoCustomer,
      );
      if (existing) {
        return {
          ok: false,
          message: "You already reviewed this product. Edit your existing review.",
        };
      }

      const review: ProductReview = {
        id: `ur-${Date.now()}`,
        productId: input.productId,
        author: `${state.profile.fullName} (Demo)`,
        rating: input.rating,
        title: input.title.trim(),
        comment: `${input.comment.trim()} (Demo review)`,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        createdAt: new Date().toISOString(),
        isDemoCustomer: true,
      };

      setState((prev) => ({
        ...prev,
        userReviews: [review, ...prev.userReviews],
      }));
      return { ok: true, message: "Review submitted", review };
    },
    [state.profile.fullName, state.userReviews],
  );

  const updateReview = useCallback(
    (id: string, input: Omit<ReviewInput, "productId">) => {
      const current = state.userReviews.find((review) => review.id === id);
      if (!current?.isDemoCustomer) {
        return { ok: false, message: "You can only edit your demo reviews." };
      }
      if (input.rating < 1 || input.rating > 5) {
        return { ok: false, message: "Choose a rating from 1 to 5." };
      }
      if (input.title.trim().length < 3) {
        return { ok: false, message: "Enter a short review title." };
      }
      if (input.comment.trim().length < 20) {
        return { ok: false, message: "Write at least 20 characters." };
      }

      setState((prev) => ({
        ...prev,
        userReviews: prev.userReviews.map((review) =>
          review.id === id
            ? {
                ...review,
                rating: input.rating,
                title: input.title.trim(),
                comment: input.comment.trim().includes("(Demo review)")
                  ? input.comment.trim()
                  : `${input.comment.trim()} (Demo review)`,
                date: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                createdAt: new Date().toISOString(),
              }
            : review,
        ),
      }));
      return { ok: true, message: "Review updated" };
    },
    [state.userReviews],
  );

  const deleteReview = useCallback(
    (id: string) => {
      const userReview = state.userReviews.find((review) => review.id === id);
      if (userReview?.isDemoCustomer) {
        setState((prev) => ({
          ...prev,
          userReviews: prev.userReviews.filter((review) => review.id !== id),
        }));
        return { ok: true, message: "Review deleted" };
      }

      const seed = seedReviews.find((review) => review.id === id);
      if (seed) {
        // Demo customer cannot delete unrelated seed reviews.
        return {
          ok: false,
          message: "Seed demo reviews from other shoppers can’t be deleted.",
        };
      }

      return { ok: false, message: "Review not found." };
    },
    [state.userReviews],
  );

  const trackProductView = useCallback((productId: string) => {
    setState((prev) => ({
      ...prev,
      recentlyViewed: [
        productId,
        ...prev.recentlyViewed.filter((id) => id !== productId),
      ].slice(0, MAX_RECENT),
    }));
  }, []);

  const addToCompare = useCallback(
    (productId: string) => {
      if (state.compareIds.includes(productId)) {
        return { ok: true, message: "Already in comparison" };
      }
      if (state.compareIds.length >= MAX_COMPARE) {
        return {
          ok: false,
          message: `Compare up to ${MAX_COMPARE} products at a time.`,
        };
      }
      setState((prev) => ({
        ...prev,
        compareIds: [...prev.compareIds, productId],
      }));
      return { ok: true, message: "Added to comparison" };
    },
    [state.compareIds],
  );

  const removeFromCompare = useCallback((productId: string) => {
    setState((prev) => ({
      ...prev,
      compareIds: prev.compareIds.filter((id) => id !== productId),
    }));
  }, []);

  const clearCompare = useCallback(() => {
    setState((prev) => ({ ...prev, compareIds: [] }));
  }, []);

  const isInCompare = useCallback(
    (productId: string) => state.compareIds.includes(productId),
    [state.compareIds],
  );

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((entry) =>
        entry.id === id ? { ...entry, read: true } : entry,
      ),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((entry) => ({
        ...entry,
        read: true,
      })),
    }));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((entry) => entry.id !== id),
    }));
  }, []);

  const clearNotifications = useCallback(() => {
    setState((prev) => ({ ...prev, notifications: [] }));
  }, []);

  const resetDemoData = useCallback(() => {
    removeKeys([...MARKET_HUB_STORAGE_KEYS]);
    setState(emptyState());
    setRatingOverrides({});
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("markethub:demo-reset"));
    }
    return {
      ok: true,
      message: "Demo data reset. Refresh to reload seed catalog state.",
    };
  }, []);

  const myReviews = useMemo(
    () => reviews.filter((review) => review.isDemoCustomer),
    [reviews],
  );
  const unreadCount = useMemo(
    () => state.notifications.filter((entry) => !entry.read).length,
    [state.notifications],
  );

  const value = useMemo<ExperienceContextValue>(
    () => ({
      ready,
      demoCustomerId: DEMO_CUSTOMER_ID,
      profile: state.profile,
      reviews,
      myReviews,
      recentlyViewedIds: state.recentlyViewed,
      compareIds: state.compareIds,
      notifications: state.notifications,
      unreadCount,
      updateProfile,
      getReviewsForProduct,
      submitReview,
      updateReview,
      deleteReview,
      trackProductView,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      clearNotifications,
      pushNotification,
      resetDemoData,
    }),
    [
      ready,
      state.profile,
      state.recentlyViewed,
      state.compareIds,
      state.notifications,
      reviews,
      myReviews,
      unreadCount,
      updateProfile,
      getReviewsForProduct,
      submitReview,
      updateReview,
      deleteReview,
      trackProductView,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      clearNotifications,
      pushNotification,
      resetDemoData,
    ],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience must be used within ExperienceProvider");
  }
  return context;
}
