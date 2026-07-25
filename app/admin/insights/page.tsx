"use client";

import {
  useAdminStatsEngagement,
  useAdminStatsFinancial,
} from "@/hooks/useAdmin";
import { StatCard } from "@/components/admin/StatCard";
import {
  VolumeByFrequencyChart,
  VolumeByGroupChart,
} from "@/components/admin/VolumeCharts";
import { Skeleton } from "@/components/ui/Skeleton";

function formatPercent(rate: number) {
  return `${(rate * 100).toFixed(1)}%`;
}

function formatHours(hours: number) {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 48) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

export default function AdminInsightsPage() {
  const { data: financial, isLoading: financialLoading } =
    useAdminStatsFinancial();
  const { data: engagement, isLoading: engagementLoading } =
    useAdminStatsEngagement();

  if (financialLoading || engagementLoading || !financial || !engagement) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-text">
            Financial
          </h2>
          <p className="text-sm text-text-muted">
            Confirmed contribution volume across the platform
          </p>
        </div>
        <VolumeByGroupChart byGroup={financial.byGroup} />
        <VolumeByFrequencyChart byFrequency={financial.byFrequency} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-text">
            Engagement
          </h2>
          <p className="text-sm text-text-muted">
            How circles are forming and moving money
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Invite acceptance rate"
            value={formatPercent(engagement.inviteAcceptanceRate)}
          />
          <StatCard
            label="Average group size"
            value={engagement.averageGroupSize.toFixed(1)}
          />
          <StatCard
            label="Avg completed cycles / group"
            value={engagement.averageCompletedCyclesPerGroup.toFixed(1)}
          />
          <StatCard
            label="Dispute rate"
            value={formatPercent(engagement.disputeRate)}
          />
          <StatCard
            label="Avg time to payment"
            value={
              engagement.averageTimeToPaymentHours == null
                ? "—"
                : formatHours(engagement.averageTimeToPaymentHours)
            }
          />
        </div>
      </section>
    </div>
  );
}
