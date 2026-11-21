"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  EXPRESS_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  formatMoney,
  paymentMethodLabel,
  resolveCartLines,
  shippingMethodLabel,
} from "@/lib/cart";
import { useExperience } from "@/lib/experience";
import { useStore } from "@/lib/store";
import type { PaymentMethod, ShippingMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

type Errors = Partial<
  Record<
    | "fullName"
    | "email"
    | "phone"
    | "address"
    | "city"
    | "state"
    | "postal"
    | "country"
    | "paymentMethod",
    string
  >
>;

export function CheckoutForm() {
  const router = useRouter();
  const { ready, cart, getCartTotals, placeOrder } = useStore();
  const { ready: profileReady, profile } = useExperience();
  const [errors, setErrors] = useState<Errors>({});
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);

  const lines = useMemo(() => resolveCartLines(cart), [cart]);
  const totals = getCartTotals(shippingMethod);
  const defaults = profileReady ? profile : null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const form = new FormData(event.currentTarget);
    const nextErrors: Errors = {};

    const fullName = String(form.get("fullName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const address = String(form.get("address") ?? "").trim();
    const city = String(form.get("city") ?? "").trim();
    const state = String(form.get("state") ?? "").trim();
    const postal = String(form.get("postal") ?? "").trim();
    const country = String(form.get("country") ?? "").trim();

    if (fullName.length < 2) nextErrors.fullName = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (phone.replace(/\D/g, "").length < 7) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if (address.length < 5) nextErrors.address = "Enter a shipping address.";
    if (city.length < 2) nextErrors.city = "Enter a city.";
    if (state.length < 2) nextErrors.state = "Enter a state or province.";
    if (postal.length < 3) nextErrors.postal = "Enter a postal code.";
    if (country.length < 2) nextErrors.country = "Enter a country.";
    if (!paymentMethod) {
      nextErrors.paymentMethod = "Select a payment method.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (lines.length === 0) {
      router.push("/shop");
      return;
    }

    setSubmitting(true);
    const result = placeOrder({
      customer: { fullName, email, phone },
      shippingAddress: { address, city, state, postal, country },
      shippingMethod,
      paymentMethod,
    });

    if (!result.ok || !result.order) {
      setSubmitting(false);
      setErrors({ paymentMethod: result.message });
      return;
    }

    router.push(`/order-success?orderId=${encodeURIComponent(result.order.id)}`);
  };

  if (!ready || !profileReady) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading checkout...
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Nothing to checkout
        </h1>
        <p className="mt-2 text-sm text-muted">
          Add products to your cart before continuing.
        </p>
        <Button href="/shop" className="mt-6">
          Browse shop
        </Button>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Checkout"
        subtitle="Simulated checkout only—no real payment or shipment is processed."
      />
      <form
        onSubmit={onSubmit}
        className="grid gap-8 lg:grid-cols-[1fr_360px]"
        noValidate
      >
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">
              Customer information
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input
                id="fullName"
                name="fullName"
                label="Full name"
                placeholder="Alex Rivera"
                defaultValue={defaults?.fullName}
                error={errors.fullName}
                className="sm:col-span-2"
                autoComplete="name"
              />
              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="alex@example.com"
                defaultValue={defaults?.email}
                error={errors.email}
                autoComplete="email"
              />
              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Phone number"
                placeholder="+1 555 0100"
                defaultValue={defaults?.phone}
                error={errors.phone}
                autoComplete="tel"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">
              Shipping information
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input
                id="address"
                name="address"
                label="Address"
                placeholder="123 Market Street"
                defaultValue={defaults?.address}
                error={errors.address}
                className="sm:col-span-2"
                autoComplete="street-address"
              />
              <Input
                id="city"
                name="city"
                label="City"
                placeholder="Austin"
                defaultValue={defaults?.city}
                error={errors.city}
                autoComplete="address-level2"
              />
              <Input
                id="state"
                name="state"
                label="State / Province"
                placeholder="TX"
                defaultValue={defaults?.state}
                error={errors.state}
                autoComplete="address-level1"
              />
              <Input
                id="postal"
                name="postal"
                label="Postal code"
                placeholder="78701"
                defaultValue={defaults?.postal}
                error={errors.postal}
                autoComplete="postal-code"
              />
              <Select
                id="country"
                name="country"
                label="Country"
                defaultValue={defaults?.country || "United States"}
                error={errors.country}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other</option>
              </Select>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">
              Delivery options
            </h2>
            <p className="mt-1 text-xs text-muted">
              Demo shipping rules: standard is free at {formatMoney(FREE_SHIPPING_THRESHOLD)}+,
              otherwise {formatMoney(STANDARD_SHIPPING_FEE)}. Express is{" "}
              {formatMoney(EXPRESS_SHIPPING_FEE)}.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    value: "standard" as const,
                    title: "Standard Delivery",
                    detail:
                      totals.subtotal >= FREE_SHIPPING_THRESHOLD
                        ? "Free · 3–5 business days"
                        : `${formatMoney(STANDARD_SHIPPING_FEE)} · 3–5 business days`,
                  },
                  {
                    value: "express" as const,
                    title: "Express Delivery",
                    detail: `${formatMoney(EXPRESS_SHIPPING_FEE)} · 1–2 business days`,
                  },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "cursor-pointer rounded-2xl border p-4 transition",
                    shippingMethod === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    className="sr-only"
                    checked={shippingMethod === option.value}
                    onChange={() => setShippingMethod(option.value)}
                  />
                  <p className="font-semibold text-text">{option.title}</p>
                  <p className="mt-1 text-sm text-muted">{option.detail}</p>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">
              Payment method
            </h2>
            <p className="mt-1 text-xs text-muted">
              Demonstration only. No card numbers, CVVs, or bank credentials are
              collected or stored.
            </p>
            <div className="mt-4 space-y-3">
              {(
                [
                  {
                    value: "cod" as const,
                    title: "Cash on Delivery",
                    detail: "Pay when your demo order arrives.",
                  },
                  {
                    value: "bank" as const,
                    title: "Bank Transfer (Demo)",
                    detail: "Simulated transfer instructions after placement.",
                  },
                  {
                    value: "card" as const,
                    title: "Card Payment (Demo)",
                    detail: "No real card details are requested in Phase 3.",
                  },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-2xl border p-4 transition",
                    paymentMethod === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="mt-1"
                    checked={paymentMethod === option.value}
                    onChange={() => setPaymentMethod(option.value)}
                  />
                  <span>
                    <span className="block font-semibold text-text">
                      {option.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {option.detail}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {errors.paymentMethod ? (
              <p className="mt-3 text-xs text-danger">{errors.paymentMethod}</p>
            ) : null}
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-4 border-b border-border pb-4">
            {lines.map((line) => (
              <li
                key={`${line.productId}-${line.variantLabel ?? "default"}`}
                className="flex gap-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={line.product.image}
                    alt={line.product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text">
                    {line.product.name}
                  </p>
                  <p className="text-xs text-muted">
                    Qty {line.quantity}
                    {line.variantLabel ? ` · ${line.variantLabel}` : ""}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {formatMoney(line.lineTotal)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatMoney(totals.subtotal)}</dd>
            </div>
            {totals.savings > 0 ? (
              <div className="flex justify-between text-success">
                <dt>Product savings</dt>
                <dd>-{formatMoney(totals.savings)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-muted">
                {shippingMethodLabel(shippingMethod)}
              </dt>
              <dd>
                {totals.shippingCost === 0
                  ? "Free"
                  : formatMoney(totals.shippingCost)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Payment</dt>
              <dd className="text-right">
                {paymentMethodLabel(paymentMethod)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
              <dt>Final total</dt>
              <dd>{formatMoney(totals.total)}</dd>
            </div>
          </dl>
          <Button
            type="submit"
            className="mt-5 w-full"
            size="lg"
            disabled={submitting}
          >
            {submitting ? "Placing order..." : "Place demo order"}
          </Button>
          <p className="mt-3 text-center text-xs text-muted">
            By placing this order you acknowledge this is a portfolio demo only.
          </p>
        </aside>
      </form>
    </div>
  );
}
