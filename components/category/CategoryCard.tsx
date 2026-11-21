import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      <div className="relative aspect-[5/4]">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/85 via-[#172033]/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="font-display text-lg font-semibold">{category.name}</h3>
          <p className="mt-1 text-xs text-white/80">
            {category.productCount} products
          </p>
        </div>
      </div>
    </Link>
  );
}
