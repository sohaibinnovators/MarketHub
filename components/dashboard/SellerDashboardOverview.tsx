"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/data";
import { DEMO_SELLER_ID, useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";

export function SellerDashboardOverview() {
  const { ready, sellerProducts, activity, storeProfile } = useMarketplace();
  const { orders } = useStore();

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading dashboard...
      </div>
    );
  }

  const relevantOrders = orders
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

  const totalProducts = sellerProducts.length;
  const activeProducts = sellerProducts.filter(
    (product) => product.listingStatus === "Active",
  ).length;
  const outOfStock = sellerProducts.filter(
    (product) =>
      product.listingStatus === "Out of Stock" || product.stock <= 0,
  ).length;
  const totalSales = relevantOrders.reduce(
    (sum, order) => sum + order.sellerTotal,
    0,
  );

  const recentActivity = activity.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted">
          Demo seller workspace for {storeProfile.name} ({DEMO_SELLER_ID}).
          Analytics use local demo records only.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Total products", value: String(totalProducts) },
          { label: "Active products", value: String(activeProducts) },
          { label: "Out of stock", value: String(outOfStock) },
          { label: "Total orders", value: String(relevantOrders.length) },
          { label: "Total sales (demo)", value: formatPrice(totalSales) },
          {
            label: "Draft products",
            value: String(
              sellerProducts.filter((product) => product.listingStatus === "Draft")
                .length,
            ),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-text">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent orders</h2>
            <Link
              href="/seller-dashboard/orders"
              className="text-sm font-semibold text-primary"
            >
              View all
            </Link>
          </div>
          {relevantOrders.length === 0 ? (
            <p className="mt-6 text-sm text-muted">
              No seller orders yet. Complete a customer checkout with your
              products to populate this list.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {relevantOrders.slice(0, 5).map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-text">{order.id}</p>
                    <p className="text-muted">{order.customer.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(order.sellerTotal)}
                    </p>
                    <p className="text-xs text-muted">{order.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              Recent product activity
            </h2>
            <Link
              href="/seller-dashboard/products"
              className="text-sm font-semibold text-primary"
            >
              Manage
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="mt-6 text-sm text-muted">
              No activity yet. Add or edit a product to see updates here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {recentActivity.map((item) => (
                <li key={item.id} className="py-3 text-sm">
                  <p className="font-medium text-text">{item.message}</p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(item.at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
