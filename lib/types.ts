export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
};

export type Seller = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  location: string;
  joinedYear: number;
  verified: boolean;
};

export type ProductBadge = "New" | "Best Seller" | "Sale" | "Limited" | "Trending";

export type ProductVariant = {
  name: string;
  options: string[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  categorySlug: string;
  sellerId: string;
  brand: string;
  rating: number;
  reviewCount: number;
  /** Demo sales volume used for Best Selling sort. */
  salesCount: number;
  /** ISO date string used for Newest sort. */
  createdAt: string;
  stock: number;
  badges: ProductBadge[];
  features: string[];
  specs: { label: string; value: string }[];
  colors?: string[];
  variants?: ProductVariant[];
  isTrending?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
};

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "bestselling";

export type CatalogFilters = {
  q: string;
  categories: string[];
  brands: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  inStock: boolean;
  onSale: boolean;
  sort: SortOption;
  page: number;
  view: "grid" | "list";
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
  variantLabel?: string;
};

export type ShippingMethod = "standard" | "express";

export type PaymentMethod = "cod" | "bank" | "card";

export type CustomerOrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered";

export type OrderLineItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  sellerName: string;
  brand: string;
  variantLabel?: string;
  unitPrice: number;
  originalPrice?: number;
  quantity: number;
  lineTotal: number;
};

export type OrderCustomer = {
  fullName: string;
  email: string;
  phone: string;
};

export type OrderShippingAddress = {
  address: string;
  city: string;
  state: string;
  postal: string;
  country: string;
};

export type CustomerOrder = {
  id: string;
  createdAt: string;
  status: CustomerOrderStatus;
  customer: OrderCustomer;
  shippingAddress: OrderShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  items: OrderLineItem[];
  subtotal: number;
  shippingCost: number;
  savings: number;
  total: number;
  notes?: string;
};

export type CartTotals = {
  subtotal: number;
  shippingCost: number;
  savings: number;
  total: number;
  itemCount: number;
  freeShippingRemaining: number | null;
};

export type FaqItem = {
  question: string;
  answer: string;
  category: string;
};

export type SellerOrder = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
};

export type SellerProductRow = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Out of Stock";
  sales: number;
  image: string;
};

export type SellerListingStatus = "Active" | "Draft" | "Out of Stock";

export type SellerStoreProfile = {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  email: string;
  phone: string;
  location: string;
};

export type SellerActivity = {
  id: string;
  type:
    | "product_added"
    | "product_updated"
    | "product_deleted"
    | "order_status"
    | "store_updated";
  message: string;
  at: string;
};

export type SellerProductRecord = Product & {
  listingStatus: SellerListingStatus;
};

export type ProductInput = {
  name: string;
  description: string;
  longDescription?: string;
  categorySlug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  listingStatus: SellerListingStatus;
  isFeatured?: boolean;
  features?: string[];
};

export type CustomerProfile = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal: string;
  country: string;
};

export type ProductReview = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  /** ISO timestamp for sorting; optional on legacy seed reviews. */
  createdAt?: string;
  /** True when authored by the demo customer in this browser. */
  isDemoCustomer?: boolean;
};

export type ReviewInput = {
  productId: string;
  rating: number;
  title: string;
  comment: string;
};

export type AppNotificationType =
  | "order_placed"
  | "order_status"
  | "wishlist"
  | "availability"
  | "seller_update"
  | "system";

export type AppNotification = {
  id: string;
  type: AppNotificationType;
  title: string;
  message: string;
  href?: string;
  createdAt: string;
  read: boolean;
};
