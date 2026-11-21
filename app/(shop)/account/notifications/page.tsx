import type { Metadata } from "next";
import { NotificationsCenter } from "@/components/account/NotificationsCenter";

export const metadata: Metadata = {
  title: "Notifications",
  description: "MarketHub demo notification center.",
};

export default function AccountNotificationsPage() {
  return <NotificationsCenter />;
}
