"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatMoney } from "@/lib/cart";
import { useStore } from "@/lib/store";
import type { CustomerOrderStatus } from "@/lib/types";

const STATUS_OPTIONS: Array<CustomerOrderStatus | "all"> = [
  "all",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
];

export function OrdersListView() {
  const { ready, orders } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("all");

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      if (status !== "all" && order.status !== status) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        order.id.toLowerCase().includes(q) ||
        order.customer.fullName.toLowerCase().includes(q) ||
        order.items.some((item) => item.name.toLowerCase().includes(q))
      );
    });
  }, [orders, query, status]);

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading orders...
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Order history"
        subtitle="Demo orders saved in your browser. No real fulfillment is connected."
      />

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm md:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by order ID, customer, or product..."
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
          <p className="font-display text-2xl font-semibold text-text">
            {orders.length === 0 ? "No orders yet" : "No matching orders"}
          </p>
          <p className="mt-2 text-sm text-muted">
            {orders.length === 0
              ? "Complete a checkout to create your first demo order."
              : "Try a different search or status filter."}
          </p>
          <Button href="/shop" className="mt-6">
            Start shopping
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-slate-50 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-text">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatMoney(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/orders/${encodeURIComponent(order.id)}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
