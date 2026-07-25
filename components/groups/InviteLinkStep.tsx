"use client";

import { Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CopyableField } from "@/components/CopyableField";

interface InviteLinkStepProps {
  inviteLink: string;
  finishing?: boolean;
  onFinish: () => void;
}

export function InviteLinkStep({
  inviteLink,
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
      <Button fullWidth onClick={onFinish} disabled={finishing}>
        {finishing ? "Opening group…" : "Go to group"}
      </Button>
    </div>
  );
}

interface StepIndicatorProps {
  step: number;
  total?: number;
}

export function StepIndicator({ step, total = 2 }: StepIndicatorProps) {
  return (
    <div className="mt-4 flex gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
        <div
          key={s}
          className={`h-1.5 flex-1 rounded-full ${
            s <= step ? "bg-primary" : "bg-primary-light/40"
          }`}
        />
      ))}
    </div>
  );
}
