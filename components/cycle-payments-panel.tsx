"use client";

import { useState } from "react";
import { Check, Flag, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/text-area";
import { ContributionStatusBadge } from "@/components/contribution-status-badge";
import {
  useConfirmContribution,
  useDisputeContribution,
  useSendReminder,
} from "@/hooks/use-cycles";
import type { Contribution, ContributionDisplayStatus } from "@/lib/api/types";
import { formatDate, formatNaira, getInitials } from "@/lib/utils";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";

interface PaymentRow {
  userId: string;
  name: string;
  status: ContributionDisplayStatus;
  contribution?: Contribution;
}

interface CyclePaymentsPanelProps {
  cycleId: string;
  groupId: string;
  contributionAmount: number;
  collectorUserId: string;
  currentUserId: string;
  rows: PaymentRow[];
  onChanged: () => void;
}

export function CyclePaymentsPanel({
  cycleId,
  groupId,
  contributionAmount,
  collectorUserId,
  currentUserId,
  rows,
  onChanged,
}: CyclePaymentsPanelProps) {
  const { toast } = useToast();
  const isCollector = currentUserId === collectorUserId;
  const confirmMut = useConfirmContribution(groupId, cycleId);
  const disputeMut = useDisputeContribution(groupId, cycleId);
  const remindMut = useSendReminder(cycleId);
  const [disputeFor, setDisputeFor] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleConfirm(contributionId: string) {
    setBusyId(contributionId);
    try {
      await confirmMut.mutateAsync(contributionId);
      toast("Payment confirmed");
      onChanged();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not confirm", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDispute(contributionId: string) {
    if (!reason.trim()) {
      toast("Say why you're flagging this receipt", "error");
      return;
    }
    setBusyId(contributionId);
    try {
      await disputeMut.mutateAsync({
        contributionId,
        reason: reason.trim(),
      });
      setDisputeFor(null);
      setReason("");
      toast("Receipt flagged");
      onChanged();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not flag receipt", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleNudge(userId: string, name: string) {
    setBusyId(userId);
    try {
      await remindMut.mutateAsync(userId);
      toast(`Nudge sent to ${name.split(" ")[0]}`);
      onChanged();
      const text = encodeURIComponent(
        `Hi ${name}, friendly reminder to send your ${formatNaira(contributionAmount)} contribution this month. Thanks! — via Pocket Circle`,
      );
      window.open(`https://wa.me/?text=${text}`, "_blank");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not send reminder", "error");
    } finally {
      setBusyId(null);
    }
  }

  if (!isCollector) return null;

  return (
    <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Collector desk
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-text">
            Confirm payments
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Review receipts, flag problems, or nudge people who haven&apos;t paid.
          </p>
        </div>
      </div>

      <ul className="pc-stagger mt-5 space-y-3">
        {rows.map((row) => {
          const contrib = row.contribution;
          return (
            <li
              key={row.userId}
              className={cn(
                "rounded-xl border bg-surface p-3 transition-shadow duration-300 hover:shadow-md",
                row.status === "disputed"
                  ? "border-danger/40"
                  : "border-primary-light/30",
              )}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light/40 text-xs font-semibold text-primary">
                  {getInitials(row.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-text">{row.name}</p>
                    <ContributionStatusBadge status={row.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {contrib?.submittedAt
                      ? `Uploaded ${formatDate(contrib.submittedAt)} · ${formatNaira(contrib.amount)}`
                      : `Expected ${formatNaira(contributionAmount)}`}
                  </p>
                  {contrib?.receiptUrl && (
                    <a
                      href={contrib.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs font-medium text-secondary hover:underline"
                    >
                      View receipt
                    </a>
                  )}
                  {contrib?.disputeReason && (
                    <p className="mt-1 text-xs text-danger">
                      {contrib.disputeReason}
                    </p>
                  )}
                  {contrib?.note && (
                    <p className="mt-1 text-xs text-text-muted">
                      Note: {contrib.note}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {contrib && contrib.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          disabled={busyId === contrib.id}
                          onClick={() => handleConfirm(contrib.id)}
                        >
                          <Check className="h-3.5 w-3.5" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setDisputeFor(
                              disputeFor === contrib.id ? null : contrib.id,
                            )
                          }
                        >
                          <Flag className="h-3.5 w-3.5" />
                          Flag
                        </Button>
                      </>
                    )}
                    {contrib && contrib.status === "disputed" && (
                      <Button
                        size="sm"
                        disabled={busyId === contrib.id}
                        onClick={() => handleConfirm(contrib.id)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Confirm anyway
                      </Button>
                    )}
                    {(row.status === "pending" || row.status === "overdue") &&
                      !contrib && (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={busyId === row.userId}
                          onClick={() => handleNudge(row.userId, row.name)}
                        >
                          <Bell className="h-3.5 w-3.5" />
                          Nudge on WhatsApp
                        </Button>
                      )}
                  </div>

                  {disputeFor === contrib?.id && (
                    <div className="mt-3 space-y-2 animate-[pc-scale-in_.22s_ease-out]">
                      <TextArea
                        label="Why are you flagging this?"
                        placeholder="e.g. Amount on receipt doesn't match"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={busyId === contrib.id}
                          onClick={() => handleDispute(contrib.id)}
                        >
                          Flag receipt
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setDisputeFor(null);
                            setReason("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
