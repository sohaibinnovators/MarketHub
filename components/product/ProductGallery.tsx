"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const gallery = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);
  const current = gallery[active] ?? gallery[0];
  const currentData = current?.startsWith("data:") ?? false;

  if (!current) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl border border-dashed border-border bg-slate-50 text-sm text-muted">
        Image unavailable
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-slate-100">
        <Image
          src={current}
          alt={`${name} image ${active + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          unoptimized={currentData}
        />
      </div>
      {gallery.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {gallery.map((image, index) => (
            <button
              key={`${image.slice(0, 48)}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={active === index}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border bg-slate-100",
                active === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50",
              )}
            >
              <Image
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
                unoptimized={image.startsWith("data:")}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
