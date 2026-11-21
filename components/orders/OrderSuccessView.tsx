"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  formatMoney,
  paymentMethodLabel,
  shippingMethodLabel,
} from "@/lib/cart";
import { useStore } from "@/lib/store";

export function OrderSuccessView() {
  const searchParams = useSearchParams();
  const { ready, orders, lastOrderId, getOrderById } = useStore();
  const orderId = searchParams.get("orderId") ?? lastOrderId;
  const order = orderId ? getOrderById(orderId) : orders[0];

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading order confirmation...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-text">
          No order to show
        </h1>
        <p className="mt-3 text-sm text-muted">
          Place a demo order from checkout to see a confirmation here.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button href="/shop">Continue shopping</Button>
          <Button href="/orders" variant="outline">
            View order history
          </Button>
        </div>
      </div>
    );
  }

  const placedOn = new Date(order.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl font-bold text-success">
          ✓
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold text-text">
          Order placed successfully
        </h1>
        <p className="mt-3 text-sm text-muted md:text-base">
          This is a simulated MarketHub confirmation. No real payment or
          shipment was processed.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Demo order number</p>
            <p className="mt-1 font-semibold text-text">{order.id}</p>
            <p className="mt-2 text-xs text-muted">Placed {placedOn}</p>
          </div>
          <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            {order.status}
          </span>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="font-display text-lg font-semibold">Ordered products</h2>
        <ul className="mt-4 space-y-4">
          {order.items.map((item) => (
            <li
              key={`${item.productId}-${item.variantLabel ?? "default"}`}
              className="flex gap-3"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-medium text-text hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-muted">
                  {item.sellerName} · Qty {item.quantity}
                  {item.variantLabel ? ` · ${item.variantLabel}` : ""}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatMoney(item.lineTotal)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Shipping</h2>
          <p className="mt-3 text-sm text-text">{order.customer.fullName}</p>
          <p className="text-sm text-muted">{order.customer.email}</p>
          <p className="text-sm text-muted">{order.customer.phone}</p>
          <p className="mt-3 text-sm text-muted">
            {order.shippingAddress.address}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postal}
            <br />
            {order.shippingAddress.country}
          </p>
          <p className="mt-3 text-sm font-medium text-text">
            {shippingMethodLabel(order.shippingMethod)}
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatMoney(order.subtotal)}</dd>
            </div>
            {order.savings > 0 ? (
              <div className="flex justify-between text-success">
                <dt>Savings</dt>
                <dd>-{formatMoney(order.savings)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>
                {order.shippingCost === 0
                  ? "Free"
                  : formatMoney(order.shippingCost)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Payment</dt>
              <dd>{paymentMethodLabel(order.paymentMethod)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd>{formatMoney(order.total)}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/shop">Continue shopping</Button>
        <Button href={`/orders/${order.id}`} variant="outline">
          View order details
        </Button>
        <Button href="/orders" variant="ghost">
          Order history
        </Button>
      </div>
    </div>
  );
}
