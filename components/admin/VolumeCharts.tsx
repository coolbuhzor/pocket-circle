"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/Button";
import {
  CHART,
  FREQ_COLORS,
  chartTooltipStyle,
  formatVolumeTick,
} from "@/components/admin/chartTheme";
import { frequencyLabel } from "@/lib/groups";
import { formatNaira } from "@/lib/utils";
import type { AdminFinancialStats } from "@/lib/api/types";

const TOP_N = 8;

interface VolumeByGroupChartProps {
  byGroup: AdminFinancialStats["byGroup"];
}

export function VolumeByGroupChart({ byGroup }: VolumeByGroupChartProps) {
  const [showAll, setShowAll] = useState(false);
  const volumeBars = useMemo(() => {
    const list = showAll ? byGroup : byGroup.slice(0, TOP_N);
    return list.map((g) => ({
      name:
        g.groupName.length > 16
          ? `${g.groupName.slice(0, 14)}…`
          : g.groupName,
      fullName: g.groupName,
      volume: g.totalConfirmedVolume,
    }));
  }, [byGroup, showAll]);

  const canToggle = byGroup.length > TOP_N;

  return (
    <div className="rounded-xl border border-primary-light/40 bg-surface p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-text">Volume by group</h3>
        {canToggle && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "Show top only" : "Show all"}
          </Button>
        )}
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={volumeBars}
            margin={{ top: 8, right: 8, left: 8, bottom: 40 }}
          >
            <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fill: CHART.tick, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: CHART.grid }}
              angle={-25}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fill: CHART.tick, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={72}
              tickFormatter={formatVolumeTick}
            />
            <Tooltip
              formatter={(value) => formatNaira(Number(value ?? 0))}
              labelFormatter={(_, payload) =>
                String(payload?.[0]?.payload?.fullName ?? "")
              }
              contentStyle={chartTooltipStyle}
            />
            <Bar dataKey="volume" name="Confirmed volume" radius={[4, 4, 0, 0]}>
              {volumeBars.map((_, i) => (
                <Cell
                  key={i}
                  fill={i % 2 === 0 ? CHART.bar : CHART.barAlt}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface VolumeByFrequencyChartProps {
  byFrequency: AdminFinancialStats["byFrequency"];
}

export function VolumeByFrequencyChart({
  byFrequency,
}: VolumeByFrequencyChartProps) {
  return (
    <div className="rounded-xl border border-primary-light/40 bg-surface p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-text">
        Volume by frequency
      </h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={byFrequency.map((f) => ({
              frequency: f.frequency,
              volume: f.totalConfirmedVolume,
              label: frequencyLabel(f.frequency),
            }))}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
          >
            <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: CHART.tick, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: CHART.grid }}
            />
            <YAxis
              tick={{ fill: CHART.tick, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={72}
              tickFormatter={formatVolumeTick}
            />
            <Tooltip
              formatter={(value) => formatNaira(Number(value ?? 0))}
              contentStyle={chartTooltipStyle}
            />
            <Bar dataKey="volume" name="Volume" radius={[4, 4, 0, 0]}>
              {byFrequency.map((f) => (
                <Cell
                  key={f.frequency}
                  fill={FREQ_COLORS[f.frequency] ?? CHART.bar}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
