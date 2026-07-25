"use client";

import { Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyableField } from "@/components/copyable-field";
import { InviteSentList } from "@/components/groups/invite-sent-list";
import type { InviteSentResult } from "@/lib/api/types";

interface InviteLinkStepProps {
  inviteLink: string;
  invitesSent?: InviteSentResult[];
  finishing?: boolean;
  onFinish: () => void;
}

export function InviteLinkStep({
  inviteLink,
  invitesSent = [],
  finishing,
  onFinish,
}: InviteLinkStepProps) {
  return (
    <div className="mt-8 space-y-4 rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light/40 text-primary">
          <LinkIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-medium text-text">Share an invite link</h2>
          <p className="mt-1 text-sm text-text-muted">
            Anyone with this link can join your group after signing up.
          </p>
        </div>
      </div>
      {inviteLink && (
        <CopyableField label="Invite link" value={inviteLink} mono={false} />
      )}
      <InviteSentList invites={invitesSent} />
      <Button fullWidth onClick={onFinish} disabled={finishing}>
        {finishing ? "Opening group…" : "Go to group"}
      </Button>
    </div>
  );
}

export { StepIndicator } from "@/components/step-indicator";
