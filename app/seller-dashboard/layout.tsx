import { Suspense } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

function SidebarFallback() {
  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <p className="text-sm text-muted">Loading navigation...</p>
      </div>
    </aside>
  );
}

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <Link
              href="/seller-dashboard"
              className="font-display text-xl font-bold text-primary"
            >
              MarketHub Seller
            </Link>
            <p className="text-xs text-muted">Demo dashboard · NovaTech Labs</p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-text hover:bg-slate-50"
          >
            View marketplace
          </Link>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <Suspense fallback={<SidebarFallback />}>
          <DashboardSidebar />
        </Suspense>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
