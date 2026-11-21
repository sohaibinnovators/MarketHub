"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { fileToPreviewDataUrl } from "@/lib/image-preview";
import { useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";
import type { SellerStoreProfile } from "@/lib/types";

function StoreProfileFields({
  initial,
  previewSlug,
}: {
  initial: SellerStoreProfile;
  previewSlug: string;
}) {
  const { updateStoreProfile } = useMarketplace();
  const { notify } = useStore();
  const [profile, setProfile] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onFile = async (
    field: "logo" | "coverImage",
    file?: File | null,
  ) => {
    if (!file) return;
    const result = await fileToPreviewDataUrl(file);
    if (!result.ok) {
      setErrors((prev) => ({ ...prev, [field]: result.message }));
      return;
    }
    setProfile((prev) => ({ ...prev, [field]: result.url }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (profile.name.trim().length < 2)
      nextErrors.name = "Enter a store name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      nextErrors.email = "Enter a valid email.";
    }
    if (profile.phone.trim().length < 7)
      nextErrors.phone = "Enter a contact number.";
    if (profile.location.trim().length < 2)
      nextErrors.location = "Enter a location.";
    if (profile.description.trim().length < 20)
      nextErrors.description = "Add a longer store description.";
    if (!profile.logo) nextErrors.logo = "Add a logo preview or URL.";
    if (!profile.coverImage)
      nextErrors.coverImage = "Add a banner preview or URL.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const result = updateStoreProfile(profile);
    notify({
      title: result.ok ? "Store profile saved" : result.message,
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
          value={profile.name}
          onChange={(event) =>
            setProfile((prev) => ({ ...prev, name: event.target.value }))
          }
          error={errors.name}
        />
        <Input
          id="tagline"
          label="Tagline"
          value={profile.tagline}
          onChange={(event) =>
            setProfile((prev) => ({ ...prev, tagline: event.target.value }))
          }
        />
        <Input
          id="email"
          type="email"
          label="Contact email"
          value={profile.email}
          onChange={(event) =>
            setProfile((prev) => ({ ...prev, email: event.target.value }))
          }
          error={errors.email}
        />
        <Input
          id="phone"
          label="Contact number"
          value={profile.phone}
          onChange={(event) =>
            setProfile((prev) => ({ ...prev, phone: event.target.value }))
          }
          error={errors.phone}
        />
        <Input
          id="location"
          label="Store location"
          value={profile.location}
          onChange={(event) =>
            setProfile((prev) => ({ ...prev, location: event.target.value }))
          }
          error={errors.location}
          className="md:col-span-2"
        />
        <Textarea
          id="description"
          label="Store description"
          value={profile.description}
          onChange={(event) =>
            setProfile((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
          error={errors.description}
          className="md:col-span-2"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Input
            id="logoUrl"
            label="Logo URL"
            value={profile.logo}
            onChange={(event) =>
              setProfile((prev) => ({ ...prev, logo: event.target.value }))
            }
            error={errors.logo}
          />
          <input
            type="file"
            accept="image/*"
            aria-label="Upload logo preview"
            className="mt-3 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary"
            onChange={(event) => onFile("logo", event.target.files?.[0])}
          />
          {profile.logo ? (
            <div className="relative mt-3 h-20 w-20 overflow-hidden rounded-2xl border border-border">
              <Image
                src={profile.logo}
                alt="Logo preview"
                fill
                unoptimized={profile.logo.startsWith("data:")}
                className="object-cover"
                sizes="80px"
              />
            </div>
          ) : null}
        </div>
        <div>
          <Input
            id="bannerUrl"
            label="Banner URL"
            value={profile.coverImage}
            onChange={(event) =>
              setProfile((prev) => ({
                ...prev,
                coverImage: event.target.value,
              }))
            }
            error={errors.coverImage}
          />
          <input
            type="file"
            accept="image/*"
            aria-label="Upload banner preview"
            className="mt-3 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary"
            onChange={(event) =>
              onFile("coverImage", event.target.files?.[0])
            }
          />
          {profile.coverImage ? (
            <div className="relative mt-3 h-28 overflow-hidden rounded-2xl border border-border">
              <Image
                src={profile.coverImage}
                alt="Banner preview"
                fill
                unoptimized={profile.coverImage.startsWith("data:")}
                className="object-cover"
                sizes="400px"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">Save store profile</Button>
        <Button href={`/seller/${previewSlug}`} variant="outline">
          Preview public store
        </Button>
      </div>
    </form>
  );
}

export function SellerStoreForm() {
  const { ready, storeProfile, demoSeller } = useMarketplace();

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading store profile...
      </div>
    );
  }

  return (
    <StoreProfileFields
      key={`${storeProfile.name}-${storeProfile.email}`}
      initial={storeProfile}
      previewSlug={demoSeller.slug}
    />
  );
}
