import type { Metadata } from "next";
import { RecentlyViewedSection } from "@/components/product/RecentlyViewedSection";

export const metadata: Metadata = {
  title: "Recently Viewed",
  description: "Recently viewed MarketHub products.",
};

export default function RecentlyViewedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">
          Recently viewed
        </h1>
        <p className="mt-2 text-sm text-muted">
          Products you opened in this browser, newest first.
        </p>
      </div>
      <RecentlyViewedSection limit={12} showEmpty />
    </div>
  );
}
