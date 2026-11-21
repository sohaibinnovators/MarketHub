import { productCatalog } from "./products-data";
import type {
  Category,
  FaqItem,
  Product,
  Review,
  Seller,
  SellerOrder,
  SellerProductRow,
} from "./types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Electronics",
    slug: "electronics",
    description: "Smart devices, audio gear, and everyday tech essentials.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    productCount: 48,
  },
  {
    id: "cat-2",
    name: "Fashion",
    slug: "fashion",
    description: "Apparel and style picks from independent brands.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    productCount: 62,
  },
  {
    id: "cat-3",
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture, décor, and comfort for modern spaces.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    productCount: 39,
  },
  {
    id: "cat-4",
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description: "Skincare, grooming, and wellness essentials.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    productCount: 34,
  },
  {
    id: "cat-5",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description: "Gear and apparel for training and outdoor activity.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
    productCount: 28,
  },
  {
    id: "cat-6",
    name: "Accessories",
    slug: "accessories",
    description: "Bags, watches, and finishing pieces for every look.",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
    productCount: 41,
  },
];

export const sellers: Seller[] = [
  {
    id: "seller-1",
    name: "NovaTech Labs",
    slug: "novatech-labs",
    tagline: "Precision tech for everyday life",
    description:
      "NovaTech Labs curates reliable electronics and smart accessories with a focus on clean design and lasting performance.",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    rating: 4.8,
    reviewCount: 1284,
    productCount: 36,
    location: "Austin, TX",
    joinedYear: 2021,
    verified: true,
  },
  {
    id: "seller-2",
    name: "Atelier North",
    slug: "atelier-north",
    tagline: "Elevated everyday fashion",
    description:
      "Atelier North offers thoughtfully designed apparel and accessories with premium materials and timeless silhouettes.",
    logo: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=80",
    rating: 4.7,
    reviewCount: 892,
    productCount: 52,
    location: "Portland, OR",
    joinedYear: 2020,
    verified: true,
  },
  {
    id: "seller-3",
    name: "Haven & Co.",
    slug: "haven-and-co",
    tagline: "Home goods that feel intentional",
    description:
      "Haven & Co. specializes in modern home essentials that blend comfort, craftsmanship, and calm aesthetics.",
    logo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
    rating: 4.9,
    reviewCount: 654,
    productCount: 29,
    location: "Chicago, IL",
    joinedYear: 2019,
    verified: true,
  },
  {
    id: "seller-4",
    name: "Lumina Beauty",
    slug: "lumina-beauty",
    tagline: "Clean formulas, radiant results",
    description:
      "Lumina Beauty creates skin-first personal care products with transparent ingredients and elegant packaging.",
    logo: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=80",
    rating: 4.6,
    reviewCount: 1102,
    productCount: 24,
    location: "Los Angeles, CA",
    joinedYear: 2022,
    verified: true,
  },
  {
    id: "seller-5",
    name: "PeakForm Athletics",
    slug: "peakform-athletics",
    tagline: "Train harder. Recover smarter.",
    description:
      "PeakForm Athletics supplies performance gear built for consistency—from studio sessions to outdoor training.",
    logo: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
    rating: 4.5,
    reviewCount: 743,
    productCount: 31,
    location: "Denver, CO",
    joinedYear: 2021,
    verified: false,
  },
  {
    id: "seller-6",
    name: "Orbit Goods",
    slug: "orbit-goods",
    tagline: "Accessories with everyday polish",
    description:
      "Orbit Goods designs bags, watches, and lifestyle accessories that balance function with refined detail.",
    logo: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=1400&q=80",
    rating: 4.8,
    reviewCount: 518,
    productCount: 27,
    location: "New York, NY",
    joinedYear: 2020,
    verified: true,
  },
];


/** Immutable seed catalog used by marketplace merge layer. */
export const productCatalogSeed: Product[] = productCatalog;

/** Default export for SSR / static pages. Client live catalog may diverge. */
export const products: Product[] = productCatalog;

function countByCategory(slug: string) {
  return products.filter((product) => product.categorySlug === slug).length;
}

function countBySeller(sellerId: string) {
  return products.filter((product) => product.sellerId === sellerId).length;
}

categories.forEach((category) => {
  category.productCount = countByCategory(category.slug);
});

sellers.forEach((seller) => {
  seller.productCount = countBySeller(seller.id);
});

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    author: "Maya R.",
    rating: 5,
    title: "Clear sound, solid battery",
    comment:
      "These earbuds stay comfortable for long calls and the noise control is genuinely useful on transit. Demo review for MarketHub UI.",
    date: "Oct 12, 2026",
  },
  {
    id: "r2",
    productId: "p1",
    author: "Jordan K.",
    rating: 4,
    title: "Great daily driver",
    comment:
      "Good fit and reliable connection. Case is compact enough for a pocket. Demo review for MarketHub UI.",
    date: "Sep 28, 2026",
  },
  {
    id: "r3",
    productId: "p4",
    author: "Elena S.",
    rating: 5,
    title: "Noticeably brighter skin",
    comment:
      "Texture is light and layers well under sunscreen. Happy with the finish after two weeks. Demo review for MarketHub UI.",
    date: "Nov 2, 2026",
  },
  {
    id: "r4",
    productId: "p5",
    author: "Chris P.",
    rating: 4,
    title: "Comfortable for easy runs",
    comment:
      "Cushioning feels responsive without being mushy. True to size for me. Demo review for MarketHub UI.",
    date: "Oct 21, 2026",
  },
  {
    id: "r5",
    productId: "p6",
    author: "Ava L.",
    rating: 5,
    title: "Polished and practical",
    comment:
      "Holds a laptop and daily essentials without looking bulky. Leather quality feels premium. Demo review for MarketHub UI.",
    date: "Nov 8, 2026",
  },
];

export const faqs: FaqItem[] = [
  {
    category: "Orders",
    question: "How do I track my order?",
    answer:
      "After checkout, you will receive an order confirmation with a tracking reference. In this demo, tracking is simulated on the Order Success page.",
  },
  {
    category: "Orders",
    question: "Can I cancel or change an order?",
    answer:
      "In a live marketplace, cancellations would be available before fulfillment. This Phase 1 demo does not process real orders.",
  },
  {
    category: "Shipping",
    question: "What are the shipping options?",
    answer:
      "MarketHub demo checkout shows Standard and Express shipping as UI options. Actual carrier rates will be added in a later phase.",
  },
  {
    category: "Shipping",
    question: "Do sellers ship internationally?",
    answer:
      "Shipping policies vary by seller. Each seller store page outlines their location and fulfillment style for this demo.",
  },
  {
    category: "Returns",
    question: "What is the return policy?",
    answer:
      "Most demo products support a 30-day return window for unused items. Return workflows will be connected in a later phase.",
  },
  {
    category: "Sellers",
    question: "How can I become a seller?",
    answer:
      "Visit the seller dashboard preview to explore the seller experience. Real seller onboarding is planned for a future phase.",
  },
  {
    category: "Account",
    question: "Do I need an account to shop?",
    answer:
      "You can browse freely. Login and Sign Up pages are included for UI demonstration only—no real authentication is connected yet.",
  },
  {
    category: "Payments",
    question: "Which payment methods are supported?",
    answer:
      "Checkout displays card and wallet options for presentation. No payment gateway is connected in Phase 1.",
  },
];

export const sellerOrders: SellerOrder[] = [
  {
    id: "ORD-1042",
    customer: "Amelia Chen",
    product: "AeroPulse Wireless Earbuds",
    amount: 89.99,
    status: "Processing",
    date: "Nov 18, 2026",
  },
  {
    id: "ORD-1041",
    customer: "Marcus Webb",
    product: "PulseCharge Power Bank",
    amount: 49.99,
    status: "Shipped",
    date: "Nov 17, 2026",
  },
  {
    id: "ORD-1040",
    customer: "Sofia Patel",
    product: "WaveTrack Smart Scale",
    amount: 59.0,
    status: "Delivered",
    date: "Nov 16, 2026",
  },
  {
    id: "ORD-1039",
    customer: "Liam Ortiz",
    product: "AeroPulse Wireless Earbuds",
    amount: 89.99,
    status: "Pending",
    date: "Nov 16, 2026",
  },
  {
    id: "ORD-1038",
    customer: "Nora Blake",
    product: "PulseCharge Power Bank",
    amount: 49.99,
    status: "Cancelled",
    date: "Nov 15, 2026",
  },
];

export const sellerProductRows: SellerProductRow[] = [
  {
    id: "p1",
    name: "AeroPulse Wireless Earbuds",
    price: 89.99,
    stock: 84,
    status: "Active",
    sales: 312,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "p7",
    name: "PulseCharge Power Bank",
    price: 49.99,
    stock: 95,
    status: "Active",
    sales: 203,
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "p15",
    name: "WaveTrack Smart Scale",
    price: 59.0,
    stock: 72,
    status: "Active",
    sales: 155,
    image:
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "sp-draft",
    name: "Nova Clip Mic (Draft)",
    price: 39.0,
    stock: 0,
    status: "Draft",
    sales: 0,
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=200&q=80",
  },
];


export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.categorySlug === slug);
}

export function getProductsBySeller(sellerId: string) {
  return products.filter((product) => product.sellerId === sellerId);
}

export function getSellerBySlug(slug: string) {
  return sellers.find((seller) => seller.slug === slug);
}

export function getSellerById(id: string) {
  return sellers.find((seller) => seller.id === id);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getFeaturedProducts(limit = 8) {
  return products.filter((product) => product.isFeatured).slice(0, limit);
}

export function getTrendingProducts(limit = 8) {
  return products.filter((product) => product.isTrending).slice(0, limit);
}

export function getBestSellerProducts(limit = 8) {
  return [...products]
    .filter((product) => product.isBestSeller)
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, limit);
}

export function getNewProducts(limit = 8) {
  return [...products]
    .filter((product) => product.isNew)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.categorySlug === product.categorySlug ||
          item.sellerId === product.sellerId),
    )
    .slice(0, limit);
}

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((product) => {
    const seller = getSellerById(product.sellerId);
    const category = getCategoryBySlug(product.categorySlug);
    return (
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.brand.toLowerCase().includes(q) ||
      seller?.name.toLowerCase().includes(q) ||
      category?.name.toLowerCase().includes(q)
    );
  });
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function getDiscountPercent(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
