"use client";

import { use } from "react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/data";
import { useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";
import type { CustomerOrderStatus } from "@/lib/types";

const STATUS_OPTIONS: CustomerOrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
];

export function SellerOrderDetailView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const orderId = decodeURIComponent(id);
  const { ready, sellerProducts, storeProfile } = useMarketplace();
  const { getOrderById, updateOrderStatus, notify } = useStore();
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
        <h1 className="font-display text-2xl font-semibold">Order not found</h1>
        <p className="mt-2 text-sm text-muted">
          This order may not exist in local demo data.
        </p>
        <Button href="/seller-dashboard/orders" className="mt-6">
          Back to orders
        </Button>
      </div>
    );
  }

  const items = order.items.filter((item) =>
    sellerProducts.some((product) => product.id === item.productId),
  );

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">
          No items for your store
        </h1>
        <p className="mt-2 text-sm text-muted">
          This customer order does not include products from {storeProfile.name}.
        </p>
        <Button href="/seller-dashboard/orders" className="mt-6">
          Back to orders
        </Button>
      </div>
    );
  }

  const sellerTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text">
            {order.id}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Placed {new Date(order.createdAt).toLocaleString()} · Showing only{" "}
            {storeProfile.name} items
          </p>
        </div>
        <Button href="/seller-dashboard/orders" variant="outline">
          Back to orders
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Your products</h2>
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.variantLabel ?? ""}`}
                className="flex justify-between gap-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-text">{item.name}</p>
                  <p className="text-muted">
                    Qty {item.quantity}
                    {item.variantLabel ? ` · ${item.variantLabel}` : ""}
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(item.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-border pt-4 text-sm font-semibold">
            <span>Seller subtotal (demo)</span>
            <span>{formatPrice(sellerTotal)}</span>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Customer</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-muted">Name</dt>
                <dd className="font-medium">{order.customer.fullName}</dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="font-medium">{order.customer.email}</dd>
              </div>
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="font-medium">{order.customer.phone}</dd>
              </div>
              <div>
                <dt className="text-muted">Ship to</dt>
                <dd className="font-medium">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} {order.shippingAddress.postal}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Fulfillment</h2>
            <label className="mt-3 block text-sm text-muted">
              Status
              <select
                value={order.status}
                onChange={(event) => {
                  const result = updateOrderStatus(
                    order.id,
                    event.target.value as CustomerOrderStatus,
                  );
                  if (!result.ok) {
                    notify({ title: result.message, tone: "error" });
                  }
                }}
                className="mt-2 h-11 w-full rounded-xl border border-border px-3 text-sm text-text"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-3 text-xs text-muted">
              Demo transitions only move forward: Pending → Processing → Shipped
              → Delivered. Customer order history stays in sync.
            </p>
            <Button
              href={`/orders/${encodeURIComponent(order.id)}`}
              variant="outline"
              className="mt-4 w-full"
            >
              Open customer view
            </Button>
          </section>
        </aside>
      </div>
    </div>
  );
}
