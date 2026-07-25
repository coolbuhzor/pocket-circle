"use client";

import { ArrowRightCircle, MessageCircle, Receipt } from "lucide-react";
import { CycleOverviewCard } from "@/components/groups/CycleOverviewCard";
import { ContributionStatusBadge } from "@/components/ContributionStatusBadge";
import { CyclePaymentsPanel } from "@/components/CyclePaymentsPanel";
import { CycleSummaryExport } from "@/components/CycleSummaryExport";
import { Button } from "@/components/ui/Button";
import type { Contribution, ContributionDisplayStatus } from "@/lib/api/types";

export type OverviewPaymentRow = {
  userId: string;
  name: string;
  status: ContributionDisplayStatus;
  contribution?: Contribution;
};

interface GroupOverviewTabProps {
  cycle: {
    id: string;
    cycleNumber: number;
    periodStart: string;
    periodEnd: string;
    collectorUserId: string;
  };
  group: {
    id: string;
    name: string;
    contributionAmount: number;
  };
  rotationMembers: { id: string; name: string }[];
  collector: {
    name: string;
    bankName?: string | null;
    accountNumber?: string | null;
  };
  currentUserId?: string;
  isCollector: boolean;
  isAdmin: boolean;
  myDisplayStatus: ContributionDisplayStatus;
  myContribution?: Contribution | null;
  paymentRows: OverviewPaymentRow[];
  nextCollector: { id: string; name: string } | null;
  closingCycle?: boolean;
  onUpload: () => void;
  onShareWhatsApp: () => void;
  onCloseCycle: () => void;
  onPaymentsChanged: () => void;
}

export function GroupOverviewTab({
  cycle,
  group,
  rotationMembers,
  collector,
  currentUserId,
  isCollector,
  isAdmin,
  myDisplayStatus,
  myContribution,
  paymentRows,
  nextCollector,
  closingCycle,
  onUpload,
  onShareWhatsApp,
  onCloseCycle,
  onPaymentsChanged,
}: GroupOverviewTabProps) {
  return (
    <div className="space-y-6">
      <CycleOverviewCard
        cycleNumber={cycle.cycleNumber}
        periodStart={cycle.periodStart}
        periodEnd={cycle.periodEnd}
        members={rotationMembers}
        collectorId={cycle.collectorUserId}
        collectorName={collector.name}
        bankName={collector.bankName}
        accountNumber={collector.accountNumber}
      />

      <div className="rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-text">Your contribution</p>
            <p className="mt-1 text-xs text-text-muted">
              {myContribution?.status === "confirmed"
                ? "Confirmed"
                : myContribution?.status === "disputed"
                  ? "Flagged — upload a clearer receipt"
                  : myContribution
                    ? "Awaiting confirmation"
                    : "Not uploaded yet"}
            </p>
          </div>
          <ContributionStatusBadge status={myDisplayStatus} />
        </div>
        {myContribution?.disputeReason && (
          <p className="mt-2 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
            {myContribution.disputeReason}
          </p>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          {!isCollector && (
            <Button onClick={onUpload} className="flex-1">
              <Receipt className="h-4 w-4" />
              {myContribution?.status === "disputed"
                ? "Upload new receipt"
                : "Upload receipt"}
            </Button>
          )}
          {myContribution && (
            <Button
              variant="secondary"
              onClick={onShareWhatsApp}
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4" />
              Share to WhatsApp
            </Button>
          )}
        </div>
      </div>

      {currentUserId && (
        <CyclePaymentsPanel
          cycleId={cycle.id}
          groupId={group.id}
          contributionAmount={group.contributionAmount}
          collectorUserId={cycle.collectorUserId}
          currentUserId={currentUserId}
          rows={paymentRows}
          onChanged={onPaymentsChanged}
        />
      )}

      <CycleSummaryExport
        groupName={group.name}
        cycleNumber={cycle.cycleNumber}
        periodStart={cycle.periodStart}
        periodEnd={cycle.periodEnd}
        collectorName={collector.name}
        contributionAmount={group.contributionAmount}
        rows={paymentRows.map((r) => ({
          name: r.name,
          status: r.status,
          amount: r.contribution?.amount,
        }))}
      />

      {(isCollector || isAdmin) && nextCollector && (
        <div className="rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-lg font-semibold text-text">
            Close this cycle
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Hand off to{" "}
            <span className="font-medium text-text">{nextCollector.name}</span>{" "}
            and start the next month.
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            disabled={closingCycle}
            onClick={onCloseCycle}
          >
            <ArrowRightCircle className="h-4 w-4" />
            {closingCycle
              ? "Closing…"
              : `Close & hand off to ${nextCollector.name.split(" ")[0]}`}
          </Button>
        </div>
      )}
    </div>
  );
}
