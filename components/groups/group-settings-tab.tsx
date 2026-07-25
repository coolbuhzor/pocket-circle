"use client";

import { Link as LinkIcon, Trash2 } from "lucide-react";
import { CopyableField } from "@/components/copyable-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AmountInput } from "@/components/ui/amount-input";
import type { GroupFrequency } from "@/lib/api/types";
import { FREQUENCY_OPTIONS } from "@/lib/groups";

export type GroupSettingsForm = {
  name: string;
  contributionAmount: number;
  frequency: GroupFrequency;
};

interface GroupSettingsTabProps {
  form: GroupSettingsForm;
  onChange: (form: GroupSettingsForm) => void;
  inviteLink: string;
  saving?: boolean;
  generatingInvite?: boolean;
  deleting?: boolean;
  onSave: () => void;
  onGenerateInvite: () => void;
  onDelete: () => void;
}

export function GroupSettingsTab({
  form,
  onChange,
  inviteLink,
  saving,
  generatingInvite,
  deleting,
  onSave,
  onGenerateInvite,
  onDelete,
}: GroupSettingsTabProps) {
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
          Generate a link and share it with friends.
        </p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={onGenerateInvite}
          disabled={generatingInvite}
        >
          <LinkIcon className="h-4 w-4" />
          Generate invite link
        </Button>
        {inviteLink && (
          <CopyableField
            className="mt-4"
            label="Invite link"
            value={inviteLink}
            mono={false}
          />
        )}
      </div>

      <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-danger">
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Deleting a group removes it for everyone. This can&apos;t be undone.
        </p>
        <Button
          variant="danger"
          className="mt-4"
          onClick={onDelete}
          disabled={deleting}
        >
          <Trash2 className="h-4 w-4" />
          Delete group
        </Button>
      </div>
    </div>
  );
}
