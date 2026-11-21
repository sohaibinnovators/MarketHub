import Link from "next/link";
import { categories } from "@/lib/data";

const shopLinks = [
  { href: "/shop", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/sellers", label: "Sellers" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/seller-dashboard", label: "Sell on MarketHub" },
];

const accountLinks = [
  { href: "/account", label: "Customer Dashboard" },
  { href: "/compare", label: "Compare" },
  { href: "/orders", label: "Order History" },
  { href: "/account/settings", label: "Profile Settings" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-[#0f172a] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="font-display text-2xl font-bold text-white">
            MarketHub
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
            One Marketplace. Endless Possibilities. Discover products from
            trusted sellers across fashion, tech, home, and more.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Shop
          </h3>
          <ul className="mt-4 space-y-2.5">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Company
          </h3>
          <ul className="mt-4 space-y-2.5">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Account
          </h3>
          <ul className="mt-4 space-y-2.5">
            {accountLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Popular categories
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="rounded-full border border-slate-700 px-2.5 py-1 text-xs hover:border-slate-500 hover:text-white"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 MarketHub. Portfolio demo project. Not a live marketplace.</p>
          <p>Phase 1 UI — mock data only.</p>
        </div>
      </div>
    </footer>
  );
}
