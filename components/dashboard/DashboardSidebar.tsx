"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMarketplace } from "@/lib/marketplace";
import { cn } from "@/lib/utils";

const links = [
  { href: "/seller-dashboard", label: "Dashboard" },
  { href: "/seller-dashboard/products", label: "My Products" },
  { href: "/seller-dashboard/products/add", label: "Add Product" },
  { href: "/seller-dashboard/orders", label: "Orders" },
  { href: "/seller-dashboard/sales", label: "Sales Overview" },
  { href: "/seller-dashboard/store", label: "Store Profile" },
  { href: "/seller-dashboard/settings", label: "Settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/seller-dashboard") return pathname === href;
  if (href === "/seller-dashboard/products") {
    return (
      pathname === href ||
      (pathname.startsWith(`${href}/`) &&
        !pathname.startsWith(`${href}/add`) &&
        !pathname.startsWith(`${href}/edit`))
    );
  }
  if (href === "/seller-dashboard/orders") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { ready, storeProfile } = useMarketplace();

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="mb-4 border-b border-border pb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Seller Hub
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-text">
            {ready ? storeProfile.name : "NovaTech Labs"}
          </p>
          <p className="mt-1 text-[11px] text-muted">Demo seller context</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-slate-50 hover:text-text",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          className="mt-4 block rounded-xl border border-border px-3 py-2.5 text-center text-sm font-medium text-text hover:bg-slate-50"
        >
          Back to Marketplace
        </Link>
      </div>
    </aside>
  );
}
