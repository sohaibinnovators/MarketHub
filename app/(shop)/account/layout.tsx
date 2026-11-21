import { Suspense } from "react";
import { AccountSidebar } from "@/components/account/AccountSidebar";

function SidebarFallback() {
  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-sm">
        Loading account...
      </div>
    </aside>
  );
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <Suspense fallback={<SidebarFallback />}>
        <AccountSidebar />
      </Suspense>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
