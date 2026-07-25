"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/Button";
import { CHART, chartTooltipStyle } from "@/components/admin/chartTheme";
import type { AdminGrowthStats } from "@/lib/api/types";

function formatDayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
}

function formatMonthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-NG", {
    month: "short",
    year: "2-digit",
  });
}

function mergeDailySeries(growth: AdminGrowthStats) {
  const groupsByDate = new Map(
    growth.byDay.groups.map((p) => [p.date, p.count]),
  );
  return growth.byDay.users.map((p) => ({
    label: formatDayLabel(p.date),
    signups: p.count,
    groupsCreated: groupsByDate.get(p.date) ?? 0,
  }));
}

function mergeMonthlySeries(growth: AdminGrowthStats) {
  const groupsByMonth = new Map(
    growth.byMonth.groups.map((p) => [p.month, p.count]),
  );
  const months = new Set([
    ...growth.byMonth.users.map((p) => p.month),
    ...growth.byMonth.groups.map((p) => p.month),
  ]);
  return [...months]
    .sort((a, b) => a.localeCompare(b))
    .map((month) => {
      const users =
        growth.byMonth.users.find((p) => p.month === month)?.count ?? 0;
      return {
        label: formatMonthLabel(month),
        signups: users,
        groupsCreated: groupsByMonth.get(month) ?? 0,
      };
    });
}

interface GrowthChartProps {
  growth: AdminGrowthStats;
}

export function GrowthChart({ growth }: GrowthChartProps) {
  const [range, setRange] = useState<"daily" | "monthly">("daily");
  const series = useMemo(
    () =>
      range === "daily" ? mergeDailySeries(growth) : mergeMonthlySeries(growth),
    [growth, range],
  );

  return (
    <section className="rounded-xl border border-primary-light/40 bg-surface p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-text">
            Growth
          </h2>
          <p className="text-sm text-text-muted">
            Signups and groups created
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={range === "daily" ? "primary" : "secondary"}
            onClick={() => setRange("daily")}
          >
            Last 30 days
          </Button>
          <Button
            size="sm"
            variant={range === "monthly" ? "primary" : "secondary"}
            onClick={() => setRange("monthly")}
          >
            Monthly all-time
          </Button>
        </div>
      </div>

      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={series}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: CHART.tick, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: CHART.grid }}
              interval={range === "daily" ? 4 : 0}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: CHART.tick, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend />
            <Line
              type="monotone"
              dataKey="signups"
              name="Signups"
              stroke={CHART.signups}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="groupsCreated"
              name="Groups created"
              stroke={CHART.groups}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
