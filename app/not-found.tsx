import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-text">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-muted">
        The page you are looking for does not exist in this MarketHub demo.
      </p>
      <Button href="/" className="mt-6">
        Back to home
      </Button>
    </div>
  );
}
