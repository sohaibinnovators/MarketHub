"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { useExperience } from "@/lib/experience";
import { useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";

export function MyReviewsView() {
  const { ready, myReviews, deleteReview } = useExperience();
  const { getProductById } = useMarketplace();
  const { notify } = useStore();

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">
          My reviews
        </h1>
        <p className="mt-2 text-sm text-muted">
          Reviews you submitted as the demo customer. Seed reviews from other
          demo shoppers are not listed here.
        </p>
      </div>

      {myReviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold">No reviews yet</p>
          <p className="mt-2 text-sm text-muted">
            Open a product page and submit a demo review.
          </p>
          <Button href="/shop" className="mt-6">
            Browse products
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {myReviews.map((review) => {
            const product = getProductById(review.productId);
            return (
              <li
                key={review.id}
                className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-text">
                      {product?.name ?? "Product unavailable"}
                    </p>
                    <div className="mt-2">
                      <StarRating rating={review.rating} />
                    </div>
                    <h2 className="mt-3 text-sm font-semibold">{review.title}</h2>
                    <p className="mt-2 text-sm text-muted">{review.comment}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product ? (
                      <Button
                        href={`/product/${product.slug}`}
                        size="sm"
                        variant="outline"
                      >
                        View product
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const result = deleteReview(review.id);
                        notify({
                          title: result.ok ? "Review deleted" : result.message,
                          tone: result.ok ? "success" : "error",
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                {!product ? (
                  <p className="mt-3 text-xs text-muted">
                    Linked product may have been removed from the demo catalog.
                  </p>
                ) : (
                  <Link
                    href={`/product/${product.slug}`}
                    className="mt-3 inline-block text-sm font-semibold text-primary"
                  >
                    Edit on product page
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
