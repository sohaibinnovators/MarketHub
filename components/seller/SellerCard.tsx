import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";
import type { Seller } from "@/lib/types";

export function SellerCard({ seller }: { seller: Seller }) {
  const coverData = seller.coverImage.startsWith("data:");
  const logoData = seller.logo.startsWith("data:");

  return (
    <Link
      href={`/seller/${seller.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-28 bg-slate-100">
        <Image
          src={seller.coverImage}
          alt={`${seller.name} store cover`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          unoptimized={coverData}
        />
      </div>
      <div className="relative px-4 pb-5 pt-8">
        <div className="absolute -top-7 left-4 h-14 w-14 overflow-hidden rounded-xl border-2 border-white bg-white shadow-sm">
          <Image
            src={seller.logo}
            alt={`${seller.name} logo`}
            fill
            sizes="56px"
            className="object-cover"
            unoptimized={logoData}
          />
        </div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-text group-hover:text-primary">
              {seller.name}
            </h3>
            <p className="mt-1 text-xs text-muted">{seller.tagline}</p>
          </div>
          {seller.verified ? (
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Verified
            </span>
          ) : null}
        </div>
        <div className="mt-3">
          <StarRating rating={seller.rating} reviewCount={seller.reviewCount} />
        </div>
        <p className="mt-3 text-xs text-muted">
          {seller.productCount} products · {seller.location}
        </p>
      </div>
    </Link>
  );
}
