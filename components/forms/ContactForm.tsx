"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const subject = String(form.get("subject") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const next: Record<string, string> = {};

    if (name.length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email.";
    if (subject.length < 3) next.subject = "Please enter a subject.";
    if (message.length < 10)
      next.message = "Please enter at least 10 characters.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="name"
          name="name"
          label="Name"
          placeholder="Your name"
          error={errors.name}
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          error={errors.email}
        />
        <Input
          id="subject"
          name="subject"
          label="Subject"
          placeholder="How can we help?"
          error={errors.subject}
          className="sm:col-span-2"
        />
        <Textarea
          id="message"
          name="message"
          label="Message"
          placeholder="Write your message..."
          error={errors.message}
          className="sm:col-span-2"
        />
      </div>
      <Button type="submit" className="mt-5">
        Send message
      </Button>
      {submitted ? (
        <p className="mt-3 text-sm text-success">
          Message validated successfully. Demo only—nothing was sent.
        </p>
      ) : null}
    </form>
  );
}
