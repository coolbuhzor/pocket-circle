import type { Invite, InviteEffectiveStatus } from "@/lib/api/types";

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
  return invite.invitedBy?.name ?? invite.inviterName ?? "Unknown";
}
