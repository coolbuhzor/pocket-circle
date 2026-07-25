import type { ColumnDef } from "@tanstack/react-table";
import type { AdminUserRow } from "@/lib/api/types";
import { formatDate, formatNaira } from "@/lib/utils";

export const adminUsersColumns: ColumnDef<AdminUserRow, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-text">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-text-muted">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-text-muted">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: "lastLoginAt",
    header: "Last active",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-text-muted">
        {row.original.lastLoginAt
          ? formatDate(row.original.lastLoginAt)
          : "Never"}
      </span>
    ),
  },
  {
    accessorKey: "groupsCount",
    header: "Groups",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-mono tabular-nums">{row.original.groupsCount}</span>
    ),
  },
  {
    accessorKey: "totalContributed",
    header: "Contributed",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-mono text-xs tabular-nums">
        {formatNaira(row.original.totalContributed)}
      </span>
    ),
  },
  {
    accessorKey: "totalCollected",
    header: "Collected",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-mono text-xs tabular-nums">
        {formatNaira(row.original.totalCollected)}
      </span>
    ),
  },
];
