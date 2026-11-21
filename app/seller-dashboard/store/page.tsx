import type { Metadata } from "next";
import { SellerStoreForm } from "@/components/dashboard/SellerStoreForm";

export const metadata: Metadata = {
  title: "Store Profile",
  description: "Manage your MarketHub store profile.",
};

export default function StoreProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">
          Store profile
        </h1>
        <p className="mt-2 text-sm text-muted">
          Public-facing store details customers see on your seller page. Image
          changes use temporary browser previews—nothing is uploaded to a
          server.
        </p>
      </div>
      <SellerStoreForm />
    </div>
  );
}
