"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { categories } from "@/lib/data";
import { useExperience } from "@/lib/experience";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/sellers", label: "Sellers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function SearchField({
  initialQuery,
  className,
  onSubmitted,
}: {
  initialQuery: string;
  className?: string;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    onSubmitted?.();
  };

  return (
    <form onSubmit={onSearch} className={className}>
      <div className="flex w-full overflow-hidden rounded-xl border border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products, sellers, categories..."
          className="h-11 w-full bg-transparent px-4 text-sm outline-none placeholder:text-slate-400"
          aria-label="Search"
        />
        <button
          type="submit"
          className="h-11 bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ready, cartCount, wishlistCount } = useStore();
  const { unreadCount, compareIds } = useExperience();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const urlQuery =
    pathname === "/search" || pathname === "/shop"
      ? (searchParams.get("q") ?? "")
      : "";
  const searchKey = `${pathname}:${urlQuery}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4 lg:h-[4.5rem]">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>

          <Link href="/" className="shrink-0">
            <span className="font-display text-xl font-bold tracking-tight text-primary md:text-2xl">
              MarketHub
            </span>
          </Link>

          <SearchField
            key={`desktop-${searchKey}`}
            initialQuery={urlQuery}
            className="mx-auto hidden max-w-xl flex-1 md:block"
          />

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/compare"
              className="relative hidden rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-slate-100 hover:text-text lg:inline-flex"
            >
              Compare
              {compareIds.length > 0 ? (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200 px-1 text-[10px] font-bold text-text">
                  {compareIds.length}
                </span>
              ) : null}
            </Link>
            <Link
              href="/account/notifications"
              className="relative hidden rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-slate-100 hover:text-text md:inline-flex"
              aria-label="Notifications"
            >
              Alerts
              {unreadCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </Link>
            <Link
              href="/account"
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-slate-100 hover:text-text sm:inline-flex"
            >
              Account
            </Link>
            <Link
              href="/wishlist"
              className="relative inline-flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-sm font-medium text-text hover:bg-slate-100"
            >
              <HeartIcon />
              <span className="hidden sm:inline">Wishlist</span>
              {ready && wishlistCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <Link
              href="/cart"
              className="relative inline-flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-sm font-medium text-text hover:bg-slate-100"
            >
              <BagIcon />
              <span className="hidden sm:inline">Cart</span>
              {ready && cartCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        <nav className="hidden items-center gap-1 border-t border-border py-2 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-slate-100 hover:text-text",
              )}
            >
              {link.label}
            </Link>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-slate-100 hover:text-text"
              onClick={() => setCategoriesOpen((open) => !open)}
            >
              Browse ▾
            </button>
            {categoriesOpen ? (
              <div className="absolute left-0 top-full z-50 w-64 rounded-xl border border-border bg-surface p-2 shadow-lg">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="block rounded-lg px-3 py-2 text-sm text-text hover:bg-slate-50"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link
            href="/seller-dashboard"
            className="ml-auto rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            Sell on MarketHub
          </Link>
        </nav>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border bg-surface px-4 py-4 lg:hidden">
          <SearchField
            key={`mobile-${searchKey}`}
            initialQuery={urlQuery}
            className="mb-4"
            onSubmitted={() => setMobileOpen(false)}
          />
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-text hover:bg-slate-50",
                )}
              >
                {link.label}
              </Link>
            ))}
            <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Categories
            </p>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-text hover:bg-slate-50"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-text hover:bg-slate-50"
            >
              Account
            </Link>
            <Link
              href="/account/notifications"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-text hover:bg-slate-50"
            >
              Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-text hover:bg-slate-50"
            >
              Compare{compareIds.length > 0 ? ` (${compareIds.length})` : ""}
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-text hover:bg-slate-50"
            >
              Orders
            </Link>
            <Link
              href="/seller-dashboard"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
            >
              Sell on MarketHub
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20s-7-4.4-9.5-8.2C.5 8.8 2.2 5 5.8 5c2 0 3.3 1.2 4.2 2.3C10.9 6.2 12.2 5 14.2 5c3.6 0 5.3 3.8 3.3 6.8C19 15.6 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 8.5h11l-.8 11.2a1.5 1.5 0 0 1-1.5 1.3H8.8a1.5 1.5 0 0 1-1.5-1.3L6.5 8.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 8.5V7a3 3 0 0 1 6 0v1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
