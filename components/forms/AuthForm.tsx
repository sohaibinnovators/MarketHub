"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();
    const next: Record<string, string> = {};

    if (mode === "signup" && name.length < 2) {
      next.name = "Please enter your name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address.";
    }
    if (password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSuccess(
      mode === "login"
        ? "Demo form validated. Opening the customer dashboard..."
        : "Demo signup validated. No real account was created.",
    );
    window.setTimeout(() => router.push("/account"), 700);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {mode === "signup" ? (
        <Input
          id="name"
          name="name"
          label="Full name"
          placeholder="Alex Rivera"
          error={errors.name}
          autoComplete="name"
        />
      ) : null}
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        error={errors.email}
        autoComplete="email"
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        error={errors.password}
        autoComplete={mode === "login" ? "current-password" : "new-password"}
      />
      <Button type="submit" className="w-full" size="lg">
        {mode === "login" ? "Continue (demo)" : "Continue (demo)"}
      </Button>
      {success ? <p className="text-sm text-success">{success}</p> : null}
      <p className="text-xs text-muted">
        Portfolio demo only. Credentials are not stored or authenticated.
      </p>
    </form>
  );
}
