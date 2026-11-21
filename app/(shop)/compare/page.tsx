import type { Metadata } from "next";
import { CompareView } from "@/components/compare/CompareView";

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare up to three MarketHub products side by side.",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CompareView />
    </div>
  );
}
