"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useExperience } from "@/lib/experience";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "My Orders" },
  { href: "/account/wishlist", label: "My Wishlist" },
  { href: "/account/recently-viewed", label: "Recently Viewed" },
  { href: "/account/reviews", label: "My Reviews" },
  { href: "/account/notifications", label: "Notifications" },
  { href: "/account/settings", label: "Profile Settings" },
  { href: "/compare", label: "Compare" },
];

function isActive(pathname: string, href: string) {
  if (href === "/account") return pathname === href;
  if (href === "/compare") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AccountSidebar() {
  const pathname = usePathname();
  const { ready, profile, unreadCount } = useExperience();

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="mb-4 border-b border-border pb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Customer Hub
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-text">
            {ready ? profile.fullName : "Alex Rivera"}
          </p>
          <p className="mt-1 text-[11px] text-muted">Demo customer context</p>
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
                {link.href === "/account/notifications" && unreadCount > 0 ? (
                  <span
                    className={cn(
                      "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                      active ? "bg-white text-primary" : "bg-primary text-white",
                    )}
                  >
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
