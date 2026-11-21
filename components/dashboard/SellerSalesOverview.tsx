"use client";

import { formatPrice } from "@/lib/data";
import { useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";

export function SellerSalesOverview() {
  const { ready, sellerProducts, storeProfile } = useMarketplace();
  const { orders } = useStore();

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading sales...
      </div>
    );
  }

  const sellerOrders = orders
    .map((order) => {
      const items = order.items.filter((item) =>
        sellerProducts.some((product) => product.id === item.productId),
      );
      if (items.length === 0) return null;
      return {
        ...order,
        items,
        sellerTotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
        units: items.reduce((sum, item) => sum + item.quantity, 0),
      };
    })
    .filter(Boolean) as Array<
    (typeof orders)[number] & {
      sellerTotal: number;
      units: number;
      items: (typeof orders)[number]["items"];
    }
  >;

  const totalSales = sellerOrders.reduce(
    (sum, order) => sum + order.sellerTotal,
    0,
  );
  const productsSold = sellerOrders.reduce(
    (sum, order) => sum + order.units,
    0,
  );

  const productSales = new Map<
    string,
    { name: string; units: number; revenue: number }
  >();
  sellerOrders.forEach((order) => {
    order.items.forEach((item) => {
      const current = productSales.get(item.productId) ?? {
        name: item.name,
        units: 0,
        revenue: 0,
      };
      current.units += item.quantity;
      current.revenue += item.lineTotal;
      productSales.set(item.productId, current);
    });
  });

  const bestSellers = Array.from(productSales.values())
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  const monthBuckets = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = date.toLocaleString("en-US", { month: "short" });
    const value = sellerOrders
      .filter((order) => {
        const created = new Date(order.createdAt);
        return (
          created.getFullYear() === date.getFullYear() &&
          created.getMonth() === date.getMonth()
        );
      })
      .reduce((sum, order) => sum + order.sellerTotal, 0);
    return { key, label, value };
  });
  const max = Math.max(...monthBuckets.map((bucket) => bucket.value), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">
          Sales overview
        </h1>
        <p className="mt-2 text-sm text-muted">
          Demonstration analytics for {storeProfile.name} based on local demo
          orders—not real business revenue.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total sales (demo)", value: formatPrice(totalSales) },
          { label: "Total orders", value: String(sellerOrders.length) },
          { label: "Products sold", value: String(productsSold) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold">Sales trend</h2>
        <div className="mt-8 flex h-56 items-end gap-3 sm:gap-4">
          {monthBuckets.map((bucket) => (
            <div
              key={bucket.key}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className="w-full rounded-t-lg bg-primary/90"
                style={{ height: `${(bucket.value / max) * 100}%` }}
                title={formatPrice(bucket.value)}
              />
              <span className="text-xs font-medium text-muted">
                {bucket.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">
            Best-selling products
          </h2>
          {bestSellers.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No sales data yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {bestSellers.map((product) => (
                <li
                  key={product.name}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-text">{product.name}</p>
                    <p className="text-muted">{product.units} sold</p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(product.revenue)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">
            Recent sales activity
          </h2>
          {sellerOrders.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No recent sales.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {sellerOrders.slice(0, 6).map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-text">{order.id}</p>
                    <p className="text-muted">
                      {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                      {order.status}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(order.sellerTotal)}
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
