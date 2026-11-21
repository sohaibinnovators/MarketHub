import type { Metadata } from "next";
import { WishlistView } from "@/components/product/WishlistView";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Saved products for the MarketHub demo customer.",
};

export default function AccountWishlistPage() {
  return <WishlistView />;
}
