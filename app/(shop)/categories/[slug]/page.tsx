import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LiveProductCatalog } from "@/components/catalog/LiveProductCatalog";
import { categories, getCategoryBySlug } from "@/lib/data";
import type { Metadata } from "next";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  return {
    title: category?.name ?? "Category",
    description: category?.description,
  };
}

function CatalogFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading category products...
      </div>
    </div>
  );
}

async function CategoryProducts({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <LiveProductCatalog
        title={category.name}
        subtitle={category.description}
        lockedCategory={slug}
        basePath={`/categories/${slug}`}
      />
    </div>
  );
}

export default function CategoryProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CategoryProducts params={params} />
    </Suspense>
  );
}
