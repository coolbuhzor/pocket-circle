"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  useMarkAllRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useNotifications";
import type { Notification } from "@/lib/api/types";
import { formatDate, cn } from "@/lib/utils";

function NotificationsContent() {
  const { data: items = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllRead();

  async function handleOpen(note: Notification) {
    if (!note.read) {
      await markRead.mutateAsync(note.id);
    }
  }

  async function handleMarkAll() {
    await markAll.mutateAsync();
  }

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {unread > 0
              ? `${unread} unread`
              : "You're all caught up"}
          </p>
        </div>
        {unread > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAll}
            disabled={markAll.isPending}
          >
            Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="mt-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-primary-light/20"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<Bell className="h-6 w-6" />}
            title="No notifications yet"
            message="When someone uploads a receipt or it's your turn, you'll see it here."
          />
        </div>
      ) : (
        <ul className="mt-8 space-y-2">
          {items.map((note) => {
            const content = (
              <div
                className={cn(
                  "rounded-xl border px-4 py-3 transition-colors",
                  note.read
                    ? "border-primary-light/20 bg-surface"
                    : "border-secondary/30 bg-secondary/5",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-text">{note.title}</p>
                    <p className="mt-0.5 text-sm text-text-muted">{note.body}</p>
                    <p className="mt-2 font-mono text-xs text-text-muted">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                  {!note.read && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  )}
                </div>
              </div>
            );

            return (
              <li key={note.id}>
                {note.href ? (
                  <Link href={note.href} onClick={() => handleOpen(note)}>
                    {content}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => handleOpen(note)}
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <RequireAuth>
      <NotificationsContent />
    </RequireAuth>
  );
}
