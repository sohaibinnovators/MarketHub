import { getLiveProducts, getLiveSellers } from "./catalog-registry";
import { formatPrice, getSellerById, products as seedProducts } from "./data";
import type {
  CartItem,
  CartTotals,
  OrderLineItem,
  Product,
  ShippingMethod,
} from "./types";

function catalogProducts() {
  const live = getLiveProducts();
  return live.length > 0 ? live : seedProducts;
}

function catalogSellerById(id: string) {
  const live = getLiveSellers().find((seller) => seller.id === id);
  return live ?? getSellerById(id);
}

/** Demo rule: free standard shipping at/above this subtotal. */
export const FREE_SHIPPING_THRESHOLD = 75;

/** Demo standard shipping fee when under the free threshold. */
export const STANDARD_SHIPPING_FEE = 6.99;

/** Demo express shipping fee. */
export const EXPRESS_SHIPPING_FEE = 14.99;

export type CartLine = CartItem & {
  product: Product;
  sellerName: string;
  unitPrice: number;
  originalPrice?: number;
  lineTotal: number;
  lineSavings: number;
  maxQuantity: number;
};

export function getProductStock(productId: string) {
  return catalogProducts().find((product) => product.id === productId)?.stock ?? 0;
}

export function resolveCartLines(cart: CartItem[]): CartLine[] {
  return cart
    .map((item) => {
      const product = catalogProducts().find(
        (entry) => entry.id === item.productId,
      );
      if (!product) return null;

      const seller = catalogSellerById(product.sellerId);
      const unitPrice = product.price;
      const originalPrice = product.originalPrice;
      const lineTotal = unitPrice * item.quantity;
      const lineSavings =
        originalPrice && originalPrice > unitPrice
          ? (originalPrice - unitPrice) * item.quantity
          : 0;

      return {
        ...item,
        product,
        sellerName: seller?.name ?? "MarketHub Seller",
        unitPrice,
        originalPrice,
        lineTotal,
        lineSavings,
        maxQuantity: Math.max(product.stock, 0),
      };
    })
    .filter(Boolean) as CartLine[];
}

export function getShippingCost(
  subtotal: number,
  method: ShippingMethod = "standard",
) {
  if (subtotal <= 0) return 0;
  if (method === "express") return EXPRESS_SHIPPING_FEE;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return STANDARD_SHIPPING_FEE;
}

export function calculateCartTotals(
  cart: CartItem[],
  shippingMethod: ShippingMethod = "standard",
): CartTotals {
  const lines = resolveCartLines(cart);
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const savings = lines.reduce((sum, line) => sum + line.lineSavings, 0);
  const shippingCost = getShippingCost(subtotal, shippingMethod);
  const total = subtotal + shippingCost;
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const freeShippingRemaining =
    shippingMethod === "standard" && subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD
      ? Number((FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2))
      : null;

  return {
    subtotal,
    shippingCost,
    savings,
    total,
    itemCount,
    freeShippingRemaining,
  };
}

export function toOrderLineItems(cart: CartItem[]): OrderLineItem[] {
  return resolveCartLines(cart).map((line) => ({
    productId: line.productId,
    name: line.product.name,
    slug: line.product.slug,
    image: line.product.image,
    sellerName: line.sellerName,
    brand: line.product.brand,
    variantLabel: line.variantLabel,
    unitPrice: line.unitPrice,
    originalPrice: line.originalPrice,
    quantity: line.quantity,
    lineTotal: line.lineTotal,
  }));
}

export function shippingMethodLabel(method: ShippingMethod) {
  return method === "express" ? "Express Delivery (Demo)" : "Standard Delivery (Demo)";
}

export function paymentMethodLabel(method: string) {
  switch (method) {
    case "cod":
      return "Cash on Delivery (Demo)";
    case "bank":
      return "Bank Transfer (Demo)";
    case "card":
      return "Card Payment (Demo)";
    default:
      return method;
  }
}

export function formatMoney(value: number) {
  return formatPrice(value);
}

export function generateOrderId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `MH-${stamp}-${suffix}`;
}
