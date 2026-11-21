"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useExperience } from "@/lib/experience";
import { useStore } from "@/lib/store";
import type { CustomerProfile } from "@/lib/types";

function ProfileFields({
  initial,
  onSave,
}: {
  initial: CustomerProfile;
  onSave: (profile: CustomerProfile) => { ok: boolean; message: string };
}) {
  const { notify } = useStore();
  const { resetDemoData } = useExperience();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmReset, setConfirmReset] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (form.fullName.trim().length < 2) next.fullName = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email.";
    }
    if (form.phone.trim().length < 7) next.phone = "Enter a valid phone.";
    if (form.address.trim().length < 3) next.address = "Enter an address.";
    if (form.city.trim().length < 2) next.city = "Enter a city.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const result = onSave(form);
    notify({
      title: result.ok ? "Profile saved" : result.message,
      tone: result.ok ? "success" : "error",
    });
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="fullName"
            label="Full name"
            value={form.fullName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, fullName: event.target.value }))
            }
            error={errors.fullName}
          />
          <Input
            id="email"
            type="email"
            label="Email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            error={errors.email}
          />
          <Input
            id="phone"
            label="Phone"
            value={form.phone}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, phone: event.target.value }))
            }
            error={errors.phone}
          />
          <Input
            id="country"
            label="Country"
            value={form.country}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, country: event.target.value }))
            }
          />
          <Input
            id="address"
            label="Address"
            value={form.address}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, address: event.target.value }))
            }
            error={errors.address}
            className="md:col-span-2"
          />
          <Input
            id="city"
            label="City"
            value={form.city}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, city: event.target.value }))
            }
            error={errors.city}
          />
          <Input
            id="state"
            label="State"
            value={form.state}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, state: event.target.value }))
            }
          />
          <Input
            id="postal"
            label="Postal code"
            value={form.postal}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, postal: event.target.value }))
            }
          />
        </div>
        <Button type="submit">Save profile</Button>
        <p className="text-xs text-muted">
          Demo profile only—no real authentication or account sync.
        </p>
      </form>

      <section className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6">
        <h2 className="font-display text-lg font-semibold text-text">
          Reset demo data
        </h2>
        <p className="mt-2 text-sm text-muted">
          Clears cart, wishlist, orders, seller edits, reviews, comparison,
          recently viewed, and notifications stored in this browser.
        </p>
        {!confirmReset ? (
          <Button
            type="button"
            variant="danger"
            className="mt-4"
            onClick={() => setConfirmReset(true)}
          >
            Reset demo data
          </Button>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                const result = resetDemoData();
                notify({ title: result.message, tone: "success" });
                setConfirmReset(false);
                window.location.reload();
              }}
            >
              Confirm reset
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

export function CustomerProfileForm() {
  const { ready, profile, updateProfile } = useExperience();

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading profile...
      </div>
    );
  }

  return (
    <ProfileFields
      key={`${profile.email}-${profile.fullName}`}
      initial={profile}
      onSave={updateProfile}
    />
  );
}
