"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";
import { readJson } from "@/lib/storage";
import type { SellerStoreProfile } from "@/lib/types";

const DEFAULT_POLICY =
  "Unused items can be returned within 30 days of delivery.";

function readPolicy() {
  const stored = readJson<{ returnPolicy?: string } | null>(
    "markethub-seller-settings-v4",
    null,
  );
  return stored?.returnPolicy?.trim() || DEFAULT_POLICY;
}

function SettingsFields({ profile }: { profile: SellerStoreProfile }) {
  const { updateStoreProfile } = useMarketplace();
  const { notify } = useStore();
  const [email, setEmail] = useState(profile.email);
  const [name, setName] = useState(profile.name);
  const [policy, setPolicy] = useState(readPolicy);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.storeName = "Enter a store name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const result = updateStoreProfile({
      ...profile,
      name: name.trim(),
      email: email.trim(),
    });
    if (result.ok) {
      localStorage.setItem(
        "markethub-seller-settings-v4",
        JSON.stringify({ returnPolicy: policy }),
      );
    }
    notify({
      title: result.ok ? "Settings saved" : result.message,
      tone: result.ok ? "success" : "error",
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6 rounded-2xl border border-border bg-surface p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="storeName"
          label="Store name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.storeName}
        />
        <Input
          id="email"
          type="email"
          label="Contact email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <Select
          id="currency"
          name="currency"
          label="Default currency"
          defaultValue="USD"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </Select>
        <Select
          id="notifications"
          name="notifications"
          label="Order notifications"
          defaultValue="all"
        >
          <option value="all">All orders</option>
          <option value="daily">Daily digest</option>
          <option value="off">Off</option>
        </Select>
        <Textarea
          id="returnPolicy"
          label="Return policy"
          value={policy}
          onChange={(event) => setPolicy(event.target.value)}
          className="md:col-span-2"
        />
      </div>
      <Button type="submit">Save settings</Button>
      <p className="text-xs text-muted">
        Demo seller context only—no real authentication or payouts.
      </p>
    </form>
  );
}

export function SellerSettingsForm() {
  const { ready, storeProfile } = useMarketplace();

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading settings...
      </div>
    );
  }

  return (
    <SettingsFields
      key={`${storeProfile.name}-${storeProfile.email}`}
      profile={storeProfile}
    />
  );
}
