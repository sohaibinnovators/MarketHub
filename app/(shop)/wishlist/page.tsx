import type { Metadata } from "next";
import { WishlistView } from "@/components/product/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Saved products on MarketHub.",
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <WishlistView />
    </div>
  );
}
