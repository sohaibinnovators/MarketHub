"use client";

import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/data";
import { useExperience } from "@/lib/experience";
import { useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";

export function CustomerDashboardOverview() {
  const { ready: storeReady, orders, wishlist } = useStore();
  const {
    ready: experienceReady,
    profile,
    myReviews,
    recentlyViewedIds,
    unreadCount,
    notifications,
  } = useExperience();
  const { ready: catalogReady, getProductById } = useMarketplace();

  if (!storeReady || !experienceReady || !catalogReady) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading dashboard...
      </div>
    );
  }

  const recentOrders = orders.slice(0, 4);
  const recentProducts = recentlyViewedIds
    .map((id) => getProductById(id))
    .filter(Boolean)
    .slice(0, 4) as NonNullable<ReturnType<typeof getProductById>>[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">
          Welcome, {profile.fullName.split(" ")[0]}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Demo customer dashboard for {profile.email}. Data stays in this
          browser only.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Orders", value: String(orders.length), href: "/account/orders" },
          {
            label: "Wishlist items",
            value: String(wishlist.length),
            href: "/account/wishlist",
          },
          {
            label: "My reviews",
            value: String(myReviews.length),
            href: "/account/reviews",
          },
          {
            label: "Unread alerts",
            value: String(unreadCount),
            href: "/account/notifications",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-text">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent orders</h2>
            <Link
              href="/account/orders"
              className="text-sm font-semibold text-primary"
            >
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="mt-6 text-sm text-muted">
              No orders yet. Complete checkout to create a demo order.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <Link
                      href={`/orders/${encodeURIComponent(order.id)}`}
                      className="font-medium text-text hover:text-primary"
                    >
                      {order.id}
                    </Link>
                    <p className="text-muted">{order.status}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              Latest notifications
            </h2>
            <Link
              href="/account/notifications"
              className="text-sm font-semibold text-primary"
            >
              Inbox
            </Link>
          </div>
          {notifications.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No notifications yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {notifications.slice(0, 5).map((entry) => (
                <li key={entry.id} className="py-3 text-sm">
                  <p
                    className={
                      entry.read
                        ? "font-medium text-text"
                        : "font-semibold text-text"
                    }
                  >
                    {entry.title}
                  </p>
                  <p className="mt-1 text-xs text-muted">{entry.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            Recently viewed
          </h2>
          <Link
            href="/account/recently-viewed"
            className="text-sm font-semibold text-primary"
          >
            See all
          </Link>
        </div>
        {recentProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
            Visit product pages to build your recently viewed list.
          </div>
        ) : (
          <ProductGrid products={recentProducts} />
        )}
      </section>
    </div>
  );
}
