import { Suspense } from "react";
import { getProductBySlug, products } from "@/lib/data";
import { LiveProductDetail } from "@/components/product/LiveProductDetail";
import type { Metadata } from "next";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

function ProductFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted sm:px-6 lg:px-8">
      Loading product...
    </div>
  );
}

async function ProductPageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <LiveProductDetail slug={slug} />;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductFallback />}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}
