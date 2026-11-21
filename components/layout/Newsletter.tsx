"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSuccess(false);
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSuccess(true);
    setEmail("");
  };

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold text-text">
            Stay ahead of new arrivals
          </h2>
          <p className="mt-2 text-sm text-muted md:text-base">
            Get curated product drops, seller spotlights, and exclusive promo
            updates in your inbox.
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-start"
        >
          <Input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={error}
            className="flex-1"
          />
          <Button type="submit" className="sm:mt-0">
            Subscribe
          </Button>
        </form>
      </div>
      {success ? (
        <p className="mx-auto max-w-7xl px-4 pb-6 text-sm text-success sm:px-6 lg:px-8">
          Thanks for subscribing. This is a demo confirmation only.
        </p>
      ) : null}
    </section>
  );
}
