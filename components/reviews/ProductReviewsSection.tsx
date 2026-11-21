"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StarRating } from "@/components/ui/StarRating";
import { useExperience } from "@/lib/experience";
import { useStore } from "@/lib/store";

export function ProductReviewsSection({ productId }: { productId: string }) {
  const {
    ready,
    getReviewsForProduct,
    submitReview,
    updateReview,
    deleteReview,
    profile,
  } = useExperience();
  const { notify } = useStore();
  const reviews = getReviewsForProduct(productId);
  const mine = reviews.find((review) => review.isDemoCustomer);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(mine?.rating ?? 5);
  const [title, setTitle] = useState(mine?.title ?? "");
  const [comment, setComment] = useState(
    mine?.comment.replace(/\s*\(Demo review\)\s*$/, "") ?? "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (
      Math.round(
        (reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length) *
          10,
      ) / 10
    );
  }, [reviews]);

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading reviews...
      </div>
    );
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (rating < 1 || rating > 5) next.rating = "Select a rating.";
    if (title.trim().length < 3) next.title = "Enter a title.";
    if (comment.trim().length < 20) next.comment = "Write at least 20 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const result = mine
      ? updateReview(mine.id, { rating, title, comment })
      : submitReview({ productId, rating, title, comment });

    notify({
      title: result.ok
        ? mine
          ? "Review updated"
          : "Review submitted"
        : result.message,
      tone: result.ok ? "success" : "error",
    });
    if (result.ok) setEditing(false);
  };

  return (
    <section className="mt-16 space-y-8">
      <SectionHeader
        title="Customer reviews"
        subtitle="Demo reviews for this portfolio UI. Ratings update product cards across the marketplace."
      />

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <p className="font-display text-3xl font-semibold">{average || "—"}</p>
          <div>
            <StarRating rating={average} reviewCount={reviews.length} size="md" />
            <p className="mt-1 text-xs text-muted">
              Based on {reviews.length} demo review
              {reviews.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold">
            {mine ? "Your demo review" : "Write a demo review"}
          </h3>
          {mine && !editing ? (
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditing(true);
                  setRating(mine.rating);
                  setTitle(mine.title);
                  setComment(
                    mine.comment.replace(/\s*\(Demo review\)\s*$/, ""),
                  );
                }}
              >
                Edit
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  const result = deleteReview(mine.id);
                  notify({
                    title: result.ok ? "Review deleted" : result.message,
                    tone: result.ok ? "success" : "error",
                  });
                }}
              >
                Delete
              </Button>
            </div>
          ) : null}
        </div>

        {!mine || editing ? (
          <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
            <p className="text-xs text-muted">
              Posting as {profile.fullName} (demo customer).
            </p>
            <div>
              <p className="mb-2 text-sm font-medium text-text">Rating</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                      rating === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-text"
                    }`}
                  >
                    {value}★
                  </button>
                ))}
              </div>
              {errors.rating ? (
                <p className="mt-1 text-xs text-danger">{errors.rating}</p>
              ) : null}
            </div>
            <Input
              id="reviewTitle"
              label="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              error={errors.title}
            />
            <Textarea
              id="reviewComment"
              label="Review"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              error={errors.comment}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit">{mine ? "Save changes" : "Submit review"}</Button>
              {mine && editing ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        ) : (
          <article className="mt-4 rounded-xl border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-text">{mine.author}</p>
              <span className="text-xs text-muted">{mine.date}</span>
            </div>
            <div className="mt-2">
              <StarRating rating={mine.rating} />
            </div>
            <h4 className="mt-3 text-sm font-semibold">{mine.title}</h4>
            <p className="mt-2 text-sm text-muted">{mine.comment}</p>
          </article>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reviews
          .filter((review) => !review.isDemoCustomer)
          .map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-text">{review.author}</p>
                <span className="text-xs text-muted">{review.date}</span>
              </div>
              <div className="mt-2">
                <StarRating rating={review.rating} />
              </div>
              <h3 className="mt-3 text-sm font-semibold">{review.title}</h3>
              <p className="mt-2 text-sm text-muted">{review.comment}</p>
            </article>
          ))}
      </div>
    </section>
  );
}
