import Link from "next/link";
import type { Metadata } from "next";
import { AuthForm } from "@/components/forms/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Demo MarketHub signup form—no real accounts are created.",
};

export default function SignUpPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-3xl font-semibold text-text">
          Demo sign up
        </h1>
        <p className="mt-2 text-sm text-muted">
          Form validation only—no account is stored and no authentication runs.
        </p>
        <div className="mt-6">
          <AuthForm mode="signup" />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Already exploring?{" "}
          <Link href="/account" className="font-semibold text-primary">
            Open Customer Hub
          </Link>
        </p>
      </div>
    </div>
  );
}
