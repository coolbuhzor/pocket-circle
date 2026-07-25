"use client";

import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import { ContributionStatusBadge } from "@/components/ContributionStatusBadge";
import { RotationCircle } from "@/components/RotationCircle";
import type { ContributionDisplayStatus } from "@/lib/api/types";
import { formatDate, formatNaira } from "@/lib/utils";

interface GroupCardProps {
  id: string;
  name: string;
  memberCount: number;
  contributionAmount: number;
  frequency?: string;
  members: { id: string; name: string }[];
  collectorId: string;
  collectorName: string;
  nextPayoutDate: string;
  myStatus: ContributionDisplayStatus;
}

export function GroupCard({
  id,
  name,
  memberCount,
  contributionAmount,
  frequency = "monthly",
  members,
  collectorId,
  collectorName,
  nextPayoutDate,
  myStatus,
}: GroupCardProps) {
  const cadence =
    frequency === "weekly"
      ? "week"
      : frequency === "biweekly"
        ? "2 weeks"
        : "month";

  return (
    <Link
      href={`/groups/${id}`}
      className="block rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-text">
            {name}
          </h3>
          <p className="mt-1 font-mono text-sm text-text-muted">
            {formatNaira(contributionAmount)} / {cadence}
          </p>
        </div>
        <ContributionStatusBadge status={myStatus} />
      </div>

      <div className="mt-5 flex items-center gap-4">
        <RotationCircle
          members={members}
          collectorId={collectorId}
          size="sm"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm text-text">
            Whose turn:{" "}
            <span className="font-semibold text-primary">{collectorName}</span>
          </p>
          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            <Users className="h-3.5 w-3.5" />
            {memberCount} members
          </p>
          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            <Calendar className="h-3.5 w-3.5" />
            Next payout{" "}
            <span className="font-mono">{formatDate(nextPayoutDate)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
