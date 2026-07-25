import { InviteStatusPill } from "@/components/invite-status-pill";
import type { Invite } from "@/lib/api/types";
import {
  inviteDisplayEmail,
  inviteSenderName,
  resolveInviteEffectiveStatus,
} from "@/lib/invites";

interface InviteListProps {
  invites: Invite[];
  emptyMessage?: string;
}

export function InviteList({
  invites,
  emptyMessage = "No invites yet.",
}: InviteListProps) {
  if (invites.length === 0) {
    return <p className="text-sm text-text-muted">{emptyMessage}</p>;
  }

  return (
    <ul className="divide-y divide-primary-light/25 rounded-xl border border-primary-light/30">
      {invites.map((invite) => (
        <li
          key={invite.token}
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text">
              {inviteDisplayEmail(invite)}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              Sent by {inviteSenderName(invite)}
            </p>
          </div>
          <InviteStatusPill status={resolveInviteEffectiveStatus(invite)} />
        </li>
      ))}
    </ul>
  );
}
