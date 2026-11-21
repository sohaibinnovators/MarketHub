import Link from "next/link";
import type { Metadata } from "next";
import { AuthForm } from "@/components/forms/AuthForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to MarketHub (demo UI only).",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-3xl font-semibold text-text">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted">
          Demo login only—no real authentication is connected.
        </p>
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Prefer the demo dashboard directly?{" "}
          <Link href="/account" className="font-semibold text-primary">
            Open Customer Hub
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-primary">
            Try demo signup
          </Link>
        </p>
      </div>
    </div>
  );
}
