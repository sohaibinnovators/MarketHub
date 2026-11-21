import { Suspense } from "react";
import { sellers, getSellerBySlug } from "@/lib/data";
import { LiveSellerStore } from "@/components/seller/LiveSellerStore";
import type { Metadata } from "next";

export function generateStaticParams() {
  return sellers.map((seller) => ({ slug: seller.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seller = getSellerBySlug(slug);
  return {
    title: seller ? `${seller.name} Store` : "Seller",
    description: seller?.description,
  };
}

function StoreFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-muted sm:px-6 lg:px-8">
      Loading store...
    </div>
  );
}

async function SellerStoreContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <LiveSellerStore slug={slug} />;
}

export default function SellerStorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<StoreFallback />}>
      <SellerStoreContent params={params} />
    </Suspense>
  );
}
