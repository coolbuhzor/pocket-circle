import type { ColumnDef } from "@tanstack/react-table";
import type { AdminGroupRow } from "@/lib/api/types";
import { frequencyLabel } from "@/lib/groups";
import { formatDate, formatNaira } from "@/lib/utils";

export const adminGroupsColumns: ColumnDef<AdminGroupRow, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-text">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "memberCount",
    header: "Members",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-mono tabular-nums">{row.original.memberCount}</span>
    ),
  },
  {
    accessorKey: "contributionAmount",
    header: "Amount",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-mono text-xs tabular-nums">
        {formatNaira(row.original.contributionAmount)}
      </span>
    ),
  },
  {
    accessorKey: "frequency",
    header: "Frequency",
    cell: ({ row }) => (
      <span className="text-text-muted">
        {frequencyLabel(row.original.frequency)}
      </span>
    ),
  },
  {
    accessorKey: "currentCycleNumber",
    header: "Cycle",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.currentCycleNumber != null
          ? `#${row.original.currentCycleNumber}`
          : "—"}
      </span>
    ),
  },
  {
    accessorKey: "currentCollectorName",
    header: "Collector",
    cell: ({ row }) => (
      <span className="text-text-muted">
        {row.original.currentCollectorName ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "totalConfirmedVolume",
    header: "Volume",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-mono text-xs tabular-nums">
        {formatNaira(row.original.totalConfirmedVolume)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-text-muted">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
];
