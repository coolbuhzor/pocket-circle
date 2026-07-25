"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Share2 } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { DataTable } from "@/components/ui/data-table";
import type { CycleHistoryRow } from "@/lib/groups";
import { formatDate, cn } from "@/lib/utils";

const baseColumns: ColumnDef<CycleHistoryRow, unknown>[] = [
  {
    accessorKey: "cycleNumber",
    header: "Cycle",
    cell: ({ row }) => (
      <span className="font-mono">#{row.original.cycleNumber}</span>
    ),
  },
  {
    accessorKey: "collectorName",
    header: "Collector",
  },
  {
    id: "period",
    header: "Period",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-text-muted">
        {formatDate(row.original.periodStart)} –{" "}
        {formatDate(row.original.periodEnd)}
      </span>
    ),
  },
];

const statusColumn: ColumnDef<CycleHistoryRow, unknown> = {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => (
    <span className="capitalize text-text-muted">{row.original.status}</span>
  ),
};

const paidColumn: ColumnDef<CycleHistoryRow, unknown> = {
  accessorKey: "paidLabel",
  header: "Paid",
  cell: ({ row }) => (
    <span className="font-mono">{row.original.paidLabel}</span>
  ),
};

interface CycleHistoryTableProps {
  rows: CycleHistoryRow[];
  variant?: "status" | "paid";
  emptyMessage?: string;
  className?: string;
  density?: "comfortable" | "compact";
}

export function CycleHistoryTable({
  rows,
  variant = "status",
  emptyMessage = "Once a cycle finishes, history appears here.",
  className,
  density = "compact",
}: CycleHistoryTableProps) {
  if (rows.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-primary-light/30 bg-surface p-6 shadow-sm",
          className,
        )}
      >
        <EmptyState
          icon={<Share2 className="h-6 w-6" />}
          title="No past cycles yet"
          message={emptyMessage}
        />
      </div>
    );
  }

  const columns = [
    ...baseColumns,
    variant === "paid" ? paidColumn : statusColumn,
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowId={(row) => row.id}
      minWidth="540px"
      density={density}
      className={cn("rounded-2xl shadow-sm", className)}
    />
  );
}
