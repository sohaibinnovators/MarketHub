import type { Metadata } from "next";
import { CheckoutForm } from "@/components/forms/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your MarketHub order (demo checkout).",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CheckoutForm />
    </div>
  );
}
