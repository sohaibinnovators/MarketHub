"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useExperience } from "@/lib/experience";

export function NotificationsCenter() {
  const {
    ready,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearNotifications,
  } = useExperience();

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text">
            Notifications
          </h1>
          <p className="mt-2 text-sm text-muted">
            Demo alerts generated from marketplace activity in this browser.
            {unreadCount > 0 ? ` ${unreadCount} unread.` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={markAllNotificationsRead}
            disabled={unreadCount === 0}
          >
            Mark all read
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={clearNotifications}
            disabled={notifications.length === 0}
          >
            Clear all
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold">All caught up</p>
          <p className="mt-2 text-sm text-muted">
            Place an order, update wishlist, or change order status to generate
            demo notifications.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((entry) => (
            <li
              key={entry.id}
              className={`rounded-2xl border p-4 shadow-sm ${
                entry.read
                  ? "border-border bg-surface"
                  : "border-primary/30 bg-primary/5"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-text">{entry.title}</p>
                  <p className="mt-1 text-sm text-muted">{entry.message}</p>
                  <p className="mt-2 text-xs text-muted">
                    {new Date(entry.createdAt).toLocaleString()} · {entry.type}
                  </p>
                  {entry.href ? (
                    <Link
                      href={entry.href}
                      onClick={() => markNotificationRead(entry.id)}
                      className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                    >
                      Open
                    </Link>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {!entry.read ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => markNotificationRead(entry.id)}
                    >
                      Mark read
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNotification(entry.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
