import type { Invite, InviteEffectiveStatus } from "@/lib/api/types";
import { getFullName } from "@/lib/user-name";

/** Prefer API `effectiveStatus`; fall back from raw status / expiry. */
export function resolveInviteEffectiveStatus(
  invite: Invite,
): InviteEffectiveStatus {
  if (invite.effectiveStatus) return invite.effectiveStatus;
  if (invite.status === "accepted") return "accepted";
  if (invite.status === "expired") return "expired";
  if (new Date(invite.expiresAt).getTime() < Date.now()) return "expired";
  return "pending";
}

export function inviteDisplayEmail(invite: Invite): string {
  const email = invite.inviteeEmail?.trim();
  return email ? email : "Link only";
}

export function inviteSenderName(invite: Invite): string {
  if (invite.invitedBy) {
    const fromParts = getFullName(invite.invitedBy);
    if (fromParts !== "Unknown") return fromParts;
  }
  return invite.inviterName ?? "Unknown";
}

/**
 * Shared copy for what happens after inviting someone by email — an existing
 * user gets notified in-app, otherwise they only have the link. Reused by both
 * the single-invite flow (group settings) and the multi-invite create-group flow.
 */
export function inviteResultMessage(matchedExistingUser: boolean): string {
  return matchedExistingUser
    ? "They'll see this invite in their notifications."
    : "They don't have an account yet — send them this link so they can sign up and join.";
}
