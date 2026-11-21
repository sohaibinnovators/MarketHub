"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useIsClient } from "./use-is-client";
import { ToastViewport, type ToastMessage } from "@/components/ui/Toast";
import {
  calculateCartTotals,
  generateOrderId,
  getProductStock,
  toOrderLineItems,
} from "./cart";
import { getLiveProducts } from "./catalog-registry";
import { products as seedProducts } from "./data";
import type {
  CartItem,
  CartTotals,
  CustomerOrder,
  CustomerOrderStatus,
  OrderCustomer,
  OrderShippingAddress,
  PaymentMethod,
  ShippingMethod,
} from "./types";

function catalog() {
  const live = getLiveProducts();
  return live.length ? live : seedProducts;
}

type AddToCartResult = {
  ok: boolean;
  message: string;
};

type StoreContextValue = {
  ready: boolean;
  cart: CartItem[];
  wishlist: string[];
  orders: CustomerOrder[];
  lastOrderId: string | null;
  cartCount: number;
  wishlistCount: number;
  getCartTotals: (shippingMethod?: ShippingMethod) => CartTotals;
  addToCart: (
    productId: string,
    quantity?: number,
    variantLabel?: string,
  ) => AddToCartResult;
  removeFromCart: (productId: string, variantLabel?: string) => void;
  updateCartQuantity: (
    productId: string,
    quantity: number,
    variantLabel?: string,
  ) => AddToCartResult;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveWishlistToCart: (productId: string) => AddToCartResult;
  placeOrder: (input: {
    customer: OrderCustomer;
    shippingAddress: OrderShippingAddress;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
  }) => { ok: boolean; order?: CustomerOrder; message: string };
  getOrderById: (id: string) => CustomerOrder | undefined;
  updateOrderStatus: (
    orderId: string,
    status: CustomerOrderStatus,
  ) => { ok: boolean; message: string };
  purgeProductReferences: (productId: string) => void;
  notify: (toast: Omit<ToastMessage, "id">) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "markethub-cart-v3";
const WISHLIST_KEY = "markethub-wishlist-v3";
const ORDERS_KEY = "markethub-orders-v3";
const LAST_ORDER_KEY = "markethub-last-order-v3";

function sameLine(item: CartItem, productId: string, variantLabel?: string) {
  return (
    item.productId === productId &&
    (item.variantLabel ?? "") === (variantLabel ?? "")
  );
}

function sanitizeCart(items: CartItem[]): CartItem[] {
  if (!Array.isArray(items)) return [];
  const next: CartItem[] = [];

  for (const raw of items) {
    if (!raw || typeof raw.productId !== "string") continue;
    const product = catalog().find((entry) => entry.id === raw.productId);
    if (!product) continue;
    if (product.stock <= 0) continue;

    const quantity = Math.min(
      Math.max(1, Number(raw.quantity) || 1),
      product.stock,
    );
    const variantLabel =
      typeof raw.variantLabel === "string" && raw.variantLabel.trim()
        ? raw.variantLabel.trim()
        : undefined;

    const existing = next.find((item) =>
      sameLine(item, raw.productId, variantLabel),
    );
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      next.push({ productId: raw.productId, quantity, variantLabel });
    }
  }

  return next;
}

function sanitizeWishlist(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  return Array.from(
    new Set(
      ids.filter(
        (id): id is string =>
          typeof id === "string" && catalog().some((product) => product.id === id),
      ),
    ),
  );
}

function sanitizeOrders(value: unknown): CustomerOrder[] {
  if (!Array.isArray(value)) return [];
  return value.filter((order) => order && typeof order.id === "string");
}

const STATUS_FLOW: CustomerOrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
];

function createSeedOrders(): CustomerOrder[] {
  const p1 = catalog().find((product) => product.id === "p1");
  const p7 = catalog().find((product) => product.id === "p7");
  const otherSellerProduct = catalog().find(
    (product) => product.sellerId !== "seller-1",
  );
  if (!p1 || !p7 || !otherSellerProduct) return [];

  const multiSubtotal = p7.price * 2 + otherSellerProduct.price;

  return [
    {
      id: "MH-SEED-1001",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      status: "Processing",
      customer: {
        fullName: "Amelia Chen",
        email: "amelia@example.com",
        phone: "+1 555 0101",
      },
      shippingAddress: {
        address: "88 Harbor Ave",
        city: "Austin",
        state: "TX",
        postal: "78701",
        country: "United States",
      },
      shippingMethod: "standard",
      paymentMethod: "card",
      items: [
        {
          productId: p1.id,
          name: p1.name,
          slug: p1.slug,
          image: p1.image,
          sellerName: "NovaTech Labs",
          brand: p1.brand,
          variantLabel: "Color: Black",
          unitPrice: p1.price,
          originalPrice: p1.originalPrice,
          quantity: 1,
          lineTotal: p1.price,
        },
      ],
      subtotal: p1.price,
      shippingCost: 0,
      savings: p1.originalPrice ? p1.originalPrice - p1.price : 0,
      total: p1.price,
      notes: "Seeded demo order for seller analytics.",
    },
    {
      id: "MH-SEED-1002",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
      status: "Pending",
      customer: {
        fullName: "Marcus Webb",
        email: "marcus@example.com",
        phone: "+1 555 0144",
      },
      shippingAddress: {
        address: "12 Oak Lane",
        city: "Dallas",
        state: "TX",
        postal: "75201",
        country: "United States",
      },
      shippingMethod: "express",
      paymentMethod: "cod",
      items: [
        {
          productId: p7.id,
          name: p7.name,
          slug: p7.slug,
          image: p7.image,
          sellerName: "NovaTech Labs",
          brand: p7.brand,
          quantity: 2,
          unitPrice: p7.price,
          originalPrice: p7.originalPrice,
          lineTotal: p7.price * 2,
        },
        {
          productId: otherSellerProduct.id,
          name: otherSellerProduct.name,
          slug: otherSellerProduct.slug,
          image: otherSellerProduct.image,
          sellerName: "Other Seller",
          brand: otherSellerProduct.brand,
          quantity: 1,
          unitPrice: otherSellerProduct.price,
          originalPrice: otherSellerProduct.originalPrice,
          lineTotal: otherSellerProduct.price,
        },
      ],
      subtotal: multiSubtotal,
      shippingCost: 14.99,
      savings: 0,
      total: multiSubtotal + 14.99,
      notes: "Multi-seller seeded order—demo sellers only see their items.",
    },
  ];
}

function readStoreSnapshot() {
  try {
    const storedCart = localStorage.getItem(CART_KEY);
    const storedWishlist = localStorage.getItem(WISHLIST_KEY);
    const storedOrders = localStorage.getItem(ORDERS_KEY);
    const storedLast = localStorage.getItem(LAST_ORDER_KEY);
    const legacyCart = storedCart ?? localStorage.getItem("markethub-cart");
    const legacyWishlist =
      storedWishlist ?? localStorage.getItem("markethub-wishlist");

    return {
      cart: legacyCart
        ? sanitizeCart(JSON.parse(legacyCart) as CartItem[])
        : ([] as CartItem[]),
      wishlist: legacyWishlist
        ? sanitizeWishlist(JSON.parse(legacyWishlist))
        : ([] as string[]),
      orders: storedOrders
        ? (() => {
            const parsed = sanitizeOrders(JSON.parse(storedOrders));
            return parsed.length > 0 ? parsed : createSeedOrders();
          })()
        : createSeedOrders(),
      lastOrderId: storedLast,
    };
  } catch {
    return {
      cart: [] as CartItem[],
      wishlist: [] as string[],
      orders: createSeedOrders(),
      lastOrderId: null as string | null,
    };
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastTimers = useRef<Map<string, number>>(new Map());

  if (isClient && !ready) {
    const snapshot = readStoreSnapshot();
    setCart(snapshot.cart);
    setWishlist(snapshot.wishlist);
    setOrders(snapshot.orders);
    setLastOrderId(snapshot.lastOrderId);
    setReady(true);
  }

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = toastTimers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
      const timer = window.setTimeout(() => dismissToast(id), 3200);
      toastTimers.current.set(id, timer);
    },
    [dismissToast],
  );

  useEffect(() => {
    const timers = toastTimers.current;
    const onReset = () => {
      setCart([]);
      setWishlist([]);
      setOrders(createSeedOrders());
      setLastOrderId(null);
    };
    window.addEventListener("markethub:demo-reset", onReset);

    return () => {
      window.removeEventListener("markethub:demo-reset", onReset);
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  useEffect(() => {
    const onDeleted = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail;
      if (!detail?.id) return;
      setCart((prev) => prev.filter((item) => item.productId !== detail.id));
      setWishlist((prev) => prev.filter((id) => id !== detail.id));
    };
    window.addEventListener("markethub:product-deleted", onDeleted);
    return () =>
      window.removeEventListener("markethub:product-deleted", onDeleted);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders, ready]);

  useEffect(() => {
    if (!ready) return;
    if (lastOrderId) localStorage.setItem(LAST_ORDER_KEY, lastOrderId);
    else localStorage.removeItem(LAST_ORDER_KEY);
  }, [lastOrderId, ready]);

  const getCartTotals = useCallback(
    (shippingMethod: ShippingMethod = "standard") =>
      calculateCartTotals(cart, shippingMethod),
    [cart],
  );

  const addToCart = useCallback(
    (
      productId: string,
      quantity = 1,
      variantLabel?: string,
    ): AddToCartResult => {
      const product = catalog().find((entry) => entry.id === productId);
      if (!product) {
        const message = "Product is unavailable.";
        notify({ title: message, tone: "error" });
        return { ok: false, message };
      }
      if (product.stock <= 0) {
        const message = "This product is out of stock.";
        notify({ title: message, tone: "error" });
        return { ok: false, message };
      }

      const addQty = Math.max(1, quantity);
      const existing = cart.find((item) =>
        sameLine(item, productId, variantLabel),
      );
      const currentQty = existing?.quantity ?? 0;

      if (currentQty >= product.stock) {
        const message = `Only ${product.stock} in stock.`;
        notify({ title: message, description: product.name, tone: "error" });
        return { ok: false, message };
      }

      const nextQty = Math.min(currentQty + addQty, product.stock);
      const message =
        nextQty < currentQty + addQty
          ? `Added up to available stock (${product.stock}).`
          : "Added to cart";

      setCart((prev) => {
        const current = prev.find((item) =>
          sameLine(item, productId, variantLabel),
        );
        if (current) {
          return prev.map((item) =>
            sameLine(item, productId, variantLabel)
              ? {
                  ...item,
                  quantity: Math.min(
                    item.quantity + addQty,
                    product.stock,
                  ),
                }
              : item,
          );
        }
        return [
          ...prev,
          {
            productId,
            quantity: Math.min(addQty, product.stock),
            variantLabel: variantLabel?.trim() || undefined,
          },
        ];
      });

      notify({
        title: message,
        description: product.name,
        tone: "success",
      });
      return { ok: true, message };
    },
    [cart, notify],
  );

  const removeFromCart = useCallback(
    (productId: string, variantLabel?: string) => {
      setCart((prev) =>
        prev.filter((item) => !sameLine(item, productId, variantLabel)),
      );
      notify({ title: "Removed from cart", tone: "info" });
    },
    [notify],
  );

  const updateCartQuantity = useCallback(
    (
      productId: string,
      quantity: number,
      variantLabel?: string,
    ): AddToCartResult => {
      const stock = getProductStock(productId);
      if (quantity <= 0) {
        removeFromCart(productId, variantLabel);
        return { ok: true, message: "Removed from cart" };
      }
      if (stock <= 0) {
        removeFromCart(productId, variantLabel);
        return { ok: false, message: "Product is out of stock." };
      }

      const nextQty = Math.min(quantity, stock);
      setCart((prev) =>
        prev.map((item) =>
          sameLine(item, productId, variantLabel)
            ? { ...item, quantity: nextQty }
            : item,
        ),
      );

      if (nextQty < quantity) {
        const message = `Only ${stock} in stock.`;
        notify({ title: message, tone: "error" });
        return { ok: false, message };
      }

      return { ok: true, message: "Quantity updated" };
    },
    [notify, removeFromCart],
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const product = catalog().find((entry) => entry.id === productId);
        if (prev.includes(productId)) {
          notify({ title: "Removed from wishlist", tone: "info" });
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("markethub:wishlist-changed", {
                detail: {
                  productId,
                  added: false,
                  name: product?.name,
                },
              }),
            );
          }
          return prev.filter((id) => id !== productId);
        }
        notify({ title: "Saved to wishlist", tone: "success" });
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("markethub:wishlist-changed", {
              detail: {
                productId,
                added: true,
                name: product?.name,
              },
            }),
          );
        }
        return [...prev, productId];
      });
    },
    [notify],
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      notify({ title: "Removed from wishlist", tone: "info" });
    },
    [notify],
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const moveWishlistToCart = useCallback(
    (productId: string): AddToCartResult => {
      const result = addToCart(productId, 1);
      if (result.ok) {
        setWishlist((prev) => prev.filter((id) => id !== productId));
      }
      return result;
    },
    [addToCart],
  );

  const placeOrder = useCallback(
    (input: {
      customer: OrderCustomer;
      shippingAddress: OrderShippingAddress;
      shippingMethod: ShippingMethod;
      paymentMethod: PaymentMethod;
    }) => {
      const lines = toOrderLineItems(cart);
      if (lines.length === 0) {
        return { ok: false, message: "Your cart is empty." };
      }

      for (const line of lines) {
        const stock = getProductStock(line.productId);
        if (stock <= 0 || line.quantity > stock) {
          return {
            ok: false,
            message: `${line.name} exceeds available demo stock.`,
          };
        }
      }

      const totals = calculateCartTotals(cart, input.shippingMethod);
      const order: CustomerOrder = {
        id: generateOrderId(),
        createdAt: new Date().toISOString(),
        status: "Pending",
        customer: input.customer,
        shippingAddress: input.shippingAddress,
        shippingMethod: input.shippingMethod,
        paymentMethod: input.paymentMethod,
        items: lines,
        subtotal: totals.subtotal,
        shippingCost: totals.shippingCost,
        savings: totals.savings,
        total: totals.total,
        notes:
          "Demo order only. No real payment or shipment was processed.",
      };

      setOrders((prev) => [order, ...prev]);
      setLastOrderId(order.id);
      setCart([]);
      notify({
        title: "Order placed",
        description: `Demo order ${order.id}`,
        tone: "success",
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("markethub:order-placed", {
            detail: { id: order.id, total: order.total },
          }),
        );
      }

      return { ok: true, order, message: "Order placed" };
    },
    [cart, notify],
  );

  const getOrderById = useCallback(
    (id: string) => orders.find((order) => order.id === id),
    [orders],
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: CustomerOrderStatus) => {
      const order = orders.find((entry) => entry.id === orderId);
      if (!order) return { ok: false, message: "Order not found." };

      const currentIndex = STATUS_FLOW.indexOf(order.status);
      const nextIndex = STATUS_FLOW.indexOf(status);
      if (nextIndex < 0) {
        return { ok: false, message: "Invalid status." };
      }
      if (nextIndex < currentIndex) {
        return {
          ok: false,
          message: "Demo status can only move forward in the fulfillment flow.",
        };
      }

      setOrders((prev) =>
        prev.map((entry) =>
          entry.id === orderId ? { ...entry, status } : entry,
        ),
      );
      notify({
        title: "Order status updated",
        description: `${orderId} → ${status}`,
        tone: "success",
      });
      if (typeof window !== "undefined" && order.status !== status) {
        window.dispatchEvent(
          new CustomEvent("markethub:order-status", {
            detail: { id: orderId, status },
          }),
        );
      }
      return { ok: true, message: "Status updated" };
    },
    [notify, orders],
  );

  const purgeProductReferences = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );
  const wishlistCount = wishlist.length;

  const value = useMemo<StoreContextValue>(
    () => ({
      ready,
      cart,
      wishlist,
      orders,
      lastOrderId,
      cartCount,
      wishlistCount,
      getCartTotals,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
      moveWishlistToCart,
      placeOrder,
      getOrderById,
      updateOrderStatus,
      purgeProductReferences,
      notify,
    }),
    [
      ready,
      cart,
      wishlist,
      orders,
      lastOrderId,
      cartCount,
      wishlistCount,
      getCartTotals,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
      moveWishlistToCart,
      placeOrder,
      getOrderById,
      updateOrderStatus,
      purgeProductReferences,
      notify,
    ],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
