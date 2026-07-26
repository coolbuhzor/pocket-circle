"use client";

import { useState } from "react";
import {
  useDeleteGroup,
  useMakeAdmin,
  useRemoveMember,
  useReorderMembers,
  useUpdateGroup,
} from "@/hooks/use-groups";
import { useCloseCycle } from "@/hooks/use-cycles";
import { useCreateInvite } from "@/hooks/use-invites";
import { useToast } from "@/components/toast";
import { ApiError } from "@/lib/api/client";
import type { GroupFrequency } from "@/lib/api/types";
import { inviteResultMessage } from "@/lib/invites";
import { formatNaira } from "@/lib/utils";

interface UseGroupDetailActionsOptions {
  groupId: string;
  groupName?: string;
  contributionAmount?: number;
  orderedMemberIds: string[];
  nextCollectorName?: string;
  collectorName?: string;
}

export function useGroupDetailActions({
  groupId,
  groupName,
  contributionAmount,
  orderedMemberIds,
  nextCollectorName,
  collectorName,
}: UseGroupDetailActionsOptions) {
  const { toast } = useToast();
  const reorderMembers = useReorderMembers(groupId);
  const makeAdmin = useMakeAdmin(groupId);
  const removeMember = useRemoveMember(groupId);
  const updateGroup = useUpdateGroup(groupId);
  const deleteGroup = useDeleteGroup(groupId);
  const createInvite = useCreateInvite(groupId);
  const closeCycle = useCloseCycle(groupId);
  const [inviteLink, setInviteLink] = useState("");

  async function handleReorder(userId: string, direction: "up" | "down") {
    const ids = [...orderedMemberIds];
    const index = ids.indexOf(userId);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= ids.length) return;
    [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
    try {
      await reorderMembers.mutateAsync(ids);
      toast("Rotation order updated");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not reorder", "error");
    }
  }

  async function handleMakeAdmin(userId: string) {
    try {
      await makeAdmin.mutateAsync(userId);
      toast("Admin added");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Could not update role",
        "error",
      );
    }
  }

  async function handleRemove(userId: string) {
    if (!confirm("Remove this member from the group?")) return;
    try {
      await removeMember.mutateAsync(userId);
      toast("Member removed");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Could not remove member",
        "error",
      );
    }
  }

  async function handleGenerateInvite(email?: string) {
    try {
      const invite = await createInvite.mutateAsync(
        email ? { email } : undefined,
      );
      const url =
        invite.url ?? `${window.location.origin}/invite/${invite.token}`;
      setInviteLink(url);
      await navigator.clipboard.writeText(url);

      if (invite.matchedExistingUser) {
        toast(inviteResultMessage(true));
      } else if (email) {
        toast(inviteResultMessage(false));
      } else {
        toast("Invite link created — share it however you like.");
      }
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Could not create invite",
        "error",
      );
    }
  }

  async function handleSaveSettings(form: {
    name: string;
    contributionAmount: number;
    frequency: GroupFrequency;
  }) {
    try {
      await updateGroup.mutateAsync({
        name: form.name,
        contributionAmount: Number(form.contributionAmount),
        frequency: form.frequency,
      });
      toast("Group settings saved");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Could not save settings",
        "error",
      );
    }
  }

  async function handleDeleteGroup() {
    if (!groupName) return;
    if (!confirm(`Delete "${groupName}"? This can't be undone.`)) return;
    try {
      await deleteGroup.mutateAsync();
      toast("Group deleted");
    } catch (err) {
      // Prefer the backend message as-is (e.g. race: someone paid after page load).
      const message =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not delete group";
      toast(message, "error");
    }
  }

  async function handleCloseCycle() {
    if (!nextCollectorName) return;
    if (
      !confirm(
        `Close this cycle and hand off to ${nextCollectorName}? Pending receipts stay on the record.`,
      )
    )
      return;
    try {
      await closeCycle.mutateAsync();
      toast(`Cycle closed — ${nextCollectorName}'s turn`);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Could not close this cycle",
        "error",
      );
    }
  }

  function shareWhatsApp() {
    if (!collectorName || !groupName || contributionAmount == null) return;
    const text = encodeURIComponent(
      `Hi ${collectorName}, I've sent my ${formatNaira(contributionAmount)} contribution for ${groupName}. Receipt uploaded on Pocket Circle.`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return {
    inviteLink,
    closingCycle: closeCycle.isPending,
    savingSettings: updateGroup.isPending,
    generatingInvite: createInvite.isPending,
    deletingGroup: deleteGroup.isPending,
    handleReorder,
    handleMakeAdmin,
    handleRemove,
    handleGenerateInvite,
    handleSaveSettings,
    handleDeleteGroup,
    handleCloseCycle,
    shareWhatsApp,
  };
}
