"use client";

import { useState } from "react";
import { InviteStatusPill } from "@/components/invite-status-pill";
import { EmailPayloadCard } from "@/components/email-payload-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast";
import { useResendInvite, useRevokeInvite } from "@/hooks/use-invites";
import type { CreateInviteResponse, Invite } from "@/lib/api/types";
import {
  inviteDisplayEmail,
  inviteSenderName,
  resolveInviteEffectiveStatus,
} from "@/lib/invites";

interface InviteListProps {
  invites: Invite[];
  emptyMessage?: string;
  /** When set, pending/expired invites can be resent; pending can be revoked. */
  groupId?: string;
  allowRevoke?: boolean;
  allowResend?: boolean;
}

export function InviteList({
  invites,
  emptyMessage = "No invites yet.",
  groupId,
  allowRevoke = Boolean(groupId),
  allowResend = Boolean(groupId),
}: InviteListProps) {
  const { toast } = useToast();
  const revokeInvite = useRevokeInvite(groupId ?? "");
  const resendInvite = useResendInvite(groupId ?? "");
  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const [resendingToken, setResendingToken] = useState<string | null>(null);
  const [lastEmailSend, setLastEmailSend] =
    useState<CreateInviteResponse | null>(null);

  async function handleRevoke(token: string) {
    if (!groupId) return;
    if (!confirm("Revoke this invite? The link will stop working.")) return;
    setRevokingToken(token);
    try {
      await revokeInvite.mutateAsync(token);
      toast("Invite revoked");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Could not revoke invite",
        "error",
      );
    } finally {
      setRevokingToken(null);
    }
  }

  async function handleResend(token: string) {
    if (!groupId) return;
    setResendingToken(token);
    try {
      const resent = await resendInvite.mutateAsync(token);
      setLastEmailSend(resent);
      toast("Invite resent");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Could not resend invite",
        "error",
      );
    } finally {
      setResendingToken(null);
    }
  }

  if (invites.length === 0) {
    return <p className="text-sm text-text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-primary-light/25 rounded-xl border border-primary-light/30">
        {invites.map((invite) => {
          const status = resolveInviteEffectiveStatus(invite);
          const showRevoke =
            allowRevoke && Boolean(groupId) && status === "pending";
          const showResend =
            allowResend &&
            Boolean(groupId) &&
            (status === "pending" || status === "expired");
          const isRevoking = revokingToken === invite.token;
          const isResending = resendingToken === invite.token;
          const actionBusy = isRevoking || isResending;

          return (
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
              <div className="flex items-center gap-2">
                <InviteStatusPill status={status} />
                {showResend && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={actionBusy}
                    onClick={() => handleResend(invite.token)}
                  >
                    {isResending ? "Resending…" : "Resend"}
                  </Button>
                )}
                {showRevoke && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-danger hover:bg-danger/5"
                    disabled={actionBusy}
                    onClick={() => handleRevoke(invite.token)}
                  >
                    {isRevoking ? "Revoking…" : "Revoke"}
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {lastEmailSend?.email && (
        <EmailPayloadCard
          payload={lastEmailSend.email}
          demoMode={lastEmailSend.demoMode}
          delivered={lastEmailSend.delivered}
          deliveryNote={lastEmailSend.deliveryNote}
          deliveryError={lastEmailSend.deliveryError}
        />
      )}
    </div>
  );
}
