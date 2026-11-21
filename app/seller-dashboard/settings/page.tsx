import type { Metadata } from "next";
import { SellerSettingsForm } from "@/components/forms/SellerSettingsForm";

export const metadata: Metadata = {
  title: "Settings",
  description: "Seller account and store settings.",
};

export default function SellerSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">
          Settings
        </h1>
        <p className="mt-2 text-sm text-muted">
          Update store preferences. Changes are validated locally in this demo.
        </p>
      </div>
      <SellerSettingsForm />
    </div>
  );
}
