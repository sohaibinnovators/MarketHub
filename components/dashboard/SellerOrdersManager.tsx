"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/data";
import { useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";
import type { CustomerOrderStatus } from "@/lib/types";

const STATUS_OPTIONS: Array<CustomerOrderStatus | "all"> = [
  "all",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
];

export function SellerOrdersManager() {
  const { ready, sellerProducts, storeProfile } = useMarketplace();
  const { orders, updateOrderStatus, notify } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("all");

  const sellerOrders = useMemo(() => {
    return orders
      .map((order) => {
        const items = order.items.filter((item) =>
          sellerProducts.some((product) => product.id === item.productId),
        );
        if (items.length === 0) return null;
        return {
          ...order,
          items,
          sellerTotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
        };
      })
      .filter(Boolean) as Array<
      (typeof orders)[number] & {
        sellerTotal: number;
        items: (typeof orders)[number]["items"];
      }
    >;
  }, [orders, sellerProducts]);

  const filtered = sellerOrders.filter((order) => {
    if (status !== "all" && order.status !== status) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      order.id.toLowerCase().includes(q) ||
      order.customer.fullName.toLowerCase().includes(q) ||
      order.customer.email.toLowerCase().includes(q)
    );
  });

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">Orders</h1>
        <p className="mt-2 text-sm text-muted">
          Orders containing products for {storeProfile.name}. Multi-seller
          orders show only your items and totals.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm md:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by order ID or customer..."
          className="h-11 flex-1 rounded-xl border border-border px-3 text-sm outline-none focus:border-primary"
        />
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as (typeof STATUS_OPTIONS)[number])
          }
          className="h-11 rounded-xl border border-border px-3 text-sm"
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === "all" ? "All statuses" : option}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold">No orders found</p>
          <p className="mt-2 text-sm text-muted">
            Place a customer checkout with your products or wait for seeded demo
            orders.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-text">{order.id}</p>
                  <p className="mt-1 text-sm text-muted">
                    {new Date(order.createdAt).toLocaleString()} ·{" "}
                    {order.customer.fullName}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {order.customer.email} · {order.customer.phone}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-bold text-text">
                    {formatPrice(order.sellerTotal)}
                  </p>
                  <p className="text-xs text-muted">Seller subtotal (demo)</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                {order.items.map((item) => (
                  <li
                    key={`${order.id}-${item.productId}-${item.variantLabel ?? ""}`}
                    className="flex justify-between gap-3"
                  >
                    <span className="text-muted">
                      {item.name} × {item.quantity}
                      {item.variantLabel ? ` · ${item.variantLabel}` : ""}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.lineTotal)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="text-sm text-muted">
                  Status
                  <select
                    value={order.status}
                    onChange={(event) => {
                      const next = event.target
                        .value as CustomerOrderStatus;
                      const result = updateOrderStatus(order.id, next);
                      if (!result.ok) {
                        notify({ title: result.message, tone: "error" });
                      }
                    }}
                    className="ml-2 h-10 rounded-xl border border-border px-3 text-sm text-text"
                  >
                    {STATUS_OPTIONS.filter((option) => option !== "all").map(
                      (option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ),
                    )}
                  </select>
                </label>
                <Button
                  href={`/seller-dashboard/orders/${encodeURIComponent(order.id)}`}
                  size="sm"
                  variant="outline"
                >
                  View details
                </Button>
                <Link
                  href={`/orders/${encodeURIComponent(order.id)}`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Customer view
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
