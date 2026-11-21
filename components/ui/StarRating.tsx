import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          "flex items-center gap-0.5 text-amber-500",
          size === "sm" ? "text-xs" : "text-sm",
        )}
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index < full || (index === full && hasHalf);
          return (
            <span key={index} className={filled ? "opacity-100" : "opacity-25"}>
              ★
            </span>
          );
        })}
      </div>
      <span className={cn("text-muted", size === "sm" ? "text-xs" : "text-sm")}>
        {rating.toFixed(1)}
        {typeof reviewCount === "number" ? ` (${reviewCount})` : ""}
      </span>
    </div>
  );
}
