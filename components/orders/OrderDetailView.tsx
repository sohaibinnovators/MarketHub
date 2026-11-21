"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  formatMoney,
  paymentMethodLabel,
  shippingMethodLabel,
} from "@/lib/cart";
import { useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";
import type { CustomerOrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_FLOW: CustomerOrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
];

function estimatedDelivery(
  createdAt: string,
  shippingMethod: "standard" | "express",
  status: CustomerOrderStatus,
) {
  const created = new Date(createdAt);
  const days = shippingMethod === "express" ? 2 : 5;
  const eta = new Date(created);
  eta.setDate(eta.getDate() + days);
  if (status === "Delivered") {
    return `Delivered (demo) on ${eta.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }
  return `Estimated demo delivery ${eta.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

export function OrderDetailView({ orderId }: { orderId: string }) {
  const { ready, getOrderById } = useStore();
  const { getSellerById, getProductById } = useMarketplace();
  const order = getOrderById(orderId);

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-text">
          Order not found
        </h1>
        <p className="mt-2 text-sm text-muted">
          This demo order ID is not in your browser history.
        </p>
        <Button href="/orders" className="mt-6">
          Back to orders
        </Button>
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted">
            <Link href="/orders" className="hover:text-primary">
              Orders
            </Link>{" "}
            / {order.id}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text">
            Order details
          </h1>
          <p className="mt-2 text-sm text-muted">
            Placed{" "}
            {new Date(order.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <p className="mt-1 text-sm font-medium text-text">
            {estimatedDelivery(
              order.createdAt,
              order.shippingMethod,
              order.status,
            )}
          </p>
        </div>
        <span className="w-fit rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          {order.status}
        </span>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="font-display text-lg font-semibold">
          Status timeline (demo)
        </h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-4">
          {STATUS_FLOW.map((step, index) => {
            const complete = index <= currentIndex;
            return (
              <li
                key={step}
                className={cn(
                  "rounded-xl border px-3 py-3 text-sm",
                  complete
                    ? "border-primary/30 bg-primary/5 text-text"
                    : "border-border bg-background text-muted",
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-wide">
                  Step {index + 1}
                </p>
                <p className="mt-1 font-semibold">{step}</p>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-xs text-muted">
          Simulated fulfillment only. Seller status updates stay synchronized
          with this customer order history.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="font-display text-lg font-semibold">Items</h2>
        <ul className="mt-4 space-y-4">
          {order.items.map((item) => {
            const liveProduct = getProductById(item.productId);
            const seller =
              (liveProduct && getSellerById(liveProduct.sellerId)) || undefined;
            return (
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
                    unoptimized={item.image.startsWith("data:")}
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
                  {seller ? (
                    <Link
                      href={`/seller/${seller.slug}`}
                      className="mt-1 inline-block text-xs font-semibold text-primary hover:underline"
                    >
                      View {seller.name} store
                    </Link>
                  ) : null}
                </div>
                <p className="text-sm font-semibold">
                  {formatMoney(item.lineTotal)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Customer</h2>
          <p className="mt-3 text-sm text-text">{order.customer.fullName}</p>
          <p className="text-sm text-muted">{order.customer.email}</p>
          <p className="text-sm text-muted">{order.customer.phone}</p>
          <h3 className="mt-5 text-sm font-semibold text-text">Ship to</h3>
          <p className="mt-2 text-sm text-muted">
            {order.shippingAddress.address}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postal}
            <br />
            {order.shippingAddress.country}
          </p>
        </section>
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Summary</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd>{shippingMethodLabel(order.shippingMethod)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Payment</dt>
              <dd>{paymentMethodLabel(order.paymentMethod)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatMoney(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>
                {order.shippingCost === 0
                  ? "Free"
                  : formatMoney(order.shippingCost)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd>{formatMoney(order.total)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted">{order.notes}</p>
        </section>
      </div>
    </div>
  );
}
