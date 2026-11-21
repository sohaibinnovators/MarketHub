import type { Metadata } from "next";
import { CustomerProfileForm } from "@/components/account/CustomerProfileForm";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Edit the MarketHub demo customer profile.",
};

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">
          Profile settings
        </h1>
        <p className="mt-2 text-sm text-muted">
          Update demo customer details stored in localStorage.
        </p>
      </div>
      <CustomerProfileForm />
    </div>
  );
}
