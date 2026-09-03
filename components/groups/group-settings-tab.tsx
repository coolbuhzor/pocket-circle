"use client";

import { FormEvent, useState } from "react";
import { Link as LinkIcon, Trash2 } from "lucide-react";
import { CopyableField } from "@/components/copyable-field";
import { EmailPayloadCard } from "@/components/email-payload-card";
import { InviteList } from "@/components/invite-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AmountInput } from "@/components/ui/amount-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroupInvites } from "@/hooks/use-invites";
import type { EmailSendResponse, GroupFrequency } from "@/lib/api/types";
import { DELETE_GROUP_BLOCKED_TOOLTIP, FREQUENCY_OPTIONS } from "@/lib/groups";

export type GroupSettingsForm = {
  name: string;
  contributionAmount: number;
  frequency: GroupFrequency;
};

interface GroupSettingsTabProps {
  groupId: string;
  form: GroupSettingsForm;
  onChange: (form: GroupSettingsForm) => void;
  inviteLink: string;
  inviteEmailSend?: EmailSendResponse | null;
  saving?: boolean;
  generatingInvite?: boolean;
  deleting?: boolean;
  canDelete?: boolean;
  onSave: () => void;
  onGenerateInvite: (email?: string) => void;
  onDelete: () => void;
}

export function GroupSettingsTab({
  groupId,
  form,
  onChange,
  inviteLink,
  inviteEmailSend,
  saving,
  generatingInvite,
  deleting,
  canDelete = true,
  onSave,
  onGenerateInvite,
  onDelete,
}: GroupSettingsTabProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const { data: invites = [], isLoading: invitesLoading } =
    useGroupInvites(groupId);

  function handleInviteSubmit(event: FormEvent) {
    event.preventDefault();
    onGenerateInvite(inviteEmail.trim() || undefined);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-lg font-semibold">Group details</h2>
        <div className="mt-4 space-y-4">
          <Input
            label="Group name"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
          />
          <AmountInput
            label="Contribution amount (₦)"
            value={form.contributionAmount}
            onChange={(value) =>
              onChange({
                ...form,
                contributionAmount: value ?? 0,
              })
            }
            placeholder="e.g. 10,000"
          />
          <Select
            label="Frequency"
            value={form.frequency}
            options={FREQUENCY_OPTIONS}
            onValueChange={(value) =>
              onChange({ ...form, frequency: value as GroupFrequency })
            }
          />
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-lg font-semibold">Invite members</h2>
        <p className="mt-1 text-sm text-text-muted">
          Generate a link to share, or optionally notify someone by email.
        </p>
        <form onSubmit={handleInviteSubmit} className="mt-4 space-y-4">
          <Input
            label="Invite by email (optional)"
            type="email"
            autoComplete="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="friend@email.com"
          />
          <Button type="submit" variant="secondary" disabled={generatingInvite}>
            <LinkIcon className="h-4 w-4" />
            {generatingInvite ? "Generating…" : "Generate invite link"}
          </Button>
        </form>
        {inviteLink && (
          <CopyableField
            className="mt-4"
            label="Invite link"
            value={inviteLink}
            mono={false}
          />
        )}
        {inviteEmailSend?.email && (
          <div className="mt-4">
            <EmailPayloadCard
              payload={inviteEmailSend.email}
              demoMode={inviteEmailSend.demoMode}
              delivered={inviteEmailSend.delivered}
              deliveryNote={inviteEmailSend.deliveryNote}
              deliveryError={inviteEmailSend.deliveryError}
            />
          </div>
        )}

        <div className="mt-6 border-t border-primary-light/25 pt-5">
          <h3 className="text-sm font-semibold text-text">Invited</h3>
          <p className="mt-0.5 text-xs text-text-muted">
            People you&apos;ve invited to this group.
          </p>
          <div className="mt-3">
            {invitesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            ) : (
              <InviteList
                groupId={groupId}
                invites={invites}
                allowRevoke
              />
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-danger">
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Deleting a group removes it for everyone. This can&apos;t be undone.
        </p>
        <span
          className="mt-4 inline-flex"
          title={canDelete ? undefined : DELETE_GROUP_BLOCKED_TOOLTIP}
        >
          <Button
            variant="danger"
            onClick={onDelete}
            disabled={deleting || !canDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete group
          </Button>
        </span>
        {!canDelete && (
          <p className="mt-2 text-xs text-text-muted">
            {DELETE_GROUP_BLOCKED_TOOLTIP}
          </p>
        )}
      </div>
    </div>
  );
}
