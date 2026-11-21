import type { Metadata } from "next";
import { SellerProductForm } from "@/components/seller/SellerProductForm";

export const metadata: Metadata = {
  title: "Add Product",
  description: "Add a new product listing to your MarketHub store.",
};

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">
          Add product
        </h1>
        <p className="mt-2 text-sm text-muted">
          Create a listing for the demo NovaTech Labs seller. Changes sync to
          the public marketplace via localStorage.
        </p>
      </div>
      <SellerProductForm mode="create" />
    </div>
  );
}
