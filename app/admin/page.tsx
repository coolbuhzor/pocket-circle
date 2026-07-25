"use client";

import {
  useAdminStatsGrowth,
  useAdminStatsOverview,
} from "@/hooks/use-admin";
import { formatNaira } from "@/lib/utils";
import { StatCard } from "@/components/admin/stat-card";
import { GrowthChart } from "@/components/admin/growth-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStatsOverview();
  const { data: growth, isLoading: growthLoading } = useAdminStatsGrowth();

  if (statsLoading || growthLoading || !stats || !growth) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="pc-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={String(stats.totalUsers)} />
        <StatCard label="Total groups" value={String(stats.totalGroups)} />
        <StatCard
          label="Confirmed volume"
          value={formatNaira(stats.totalConfirmedVolume)}
        />
        <StatCard
          label="Active cycles"
          value={String(stats.totalActiveCycles)}
        />
      </div>
      <GrowthChart growth={growth} />
    </div>
  );
}
