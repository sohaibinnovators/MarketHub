import type { Metadata } from "next";
import { CartView } from "@/components/product/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items in your MarketHub shopping cart.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CartView />
    </div>
  );
}
