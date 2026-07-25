"use client";

import {
  Bell,
  CheckCircle2,
  Flag,
  Receipt,
  RefreshCw,
  UserPlus,
  CircleDot,
} from "lucide-react";
import type { ActivityEvent, ActivityType } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

const icons: Record<ActivityType, typeof Receipt> = {
  member_joined: UserPlus,
  receipt_uploaded: Receipt,
  payment_confirmed: CheckCircle2,
  payment_disputed: Flag,
  reminder_sent: Bell,
  cycle_started: RefreshCw,
  cycle_completed: RefreshCw,
  turn_changed: CircleDot,
};

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={<RefreshCw className="h-6 w-6" />}
        title="No activity yet"
        message="Uploads, confirmations, nudges, and cycle changes will show up here."
      />
    );
  }

  return (
    <ol className="pc-stagger space-y-3">
      {events.map((event) => {
        const Icon = icons[event.type];
        return (
          <li
            key={event.id}
            className="group flex gap-3 rounded-xl border border-primary-light/30 bg-surface p-3 shadow-sm transition-all duration-300 hover:border-primary-light/60 hover:shadow-md"
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light/30 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-text">{event.message}</p>
              <p className="mt-1 font-mono text-xs text-text-muted">
                {formatDate(event.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
