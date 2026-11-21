import type { Metadata } from "next";
import { MyReviewsView } from "@/components/account/MyReviewsView";

export const metadata: Metadata = {
  title: "My Reviews",
  description: "Demo customer product reviews on MarketHub.",
};

export default function AccountReviewsPage() {
  return <MyReviewsView />;
}
