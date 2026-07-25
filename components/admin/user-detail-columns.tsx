import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { AdminUserDetail } from "@/lib/api/types";
import { formatDate, formatNaira } from "@/lib/utils";

type UserGroupRow = AdminUserDetail["groups"][number];
type UserContributionRow = AdminUserDetail["contributions"][number];

export const adminUserGroupColumns: ColumnDef<UserGroupRow, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/admin/groups/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="capitalize text-text-muted">{row.original.role}</span>
    ),
  },
  {
    accessorKey: "payoutOrder",
    header: "Payout position",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-mono tabular-nums">{row.original.payoutOrder}</span>
    ),
  },
];

export const adminUserContributionColumns: ColumnDef<
  UserContributionRow,
  unknown
>[] = [
  {
    accessorKey: "groupName",
    header: "Group",
    cell: ({ row }) => (
      <Link
        href={`/admin/groups/${row.original.groupId}`}
        className="text-primary hover:underline"
      >
        {row.original.groupName}
      </Link>
    ),
  },
  {
    accessorKey: "cycleNumber",
    header: "Cycle",
    cell: ({ row }) => (
      <span className="font-mono text-xs">#{row.original.cycleNumber}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-mono text-xs tabular-nums">
        {formatNaira(row.original.amount)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="capitalize text-text-muted">{row.original.status}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-text-muted">
        {row.original.date ? formatDate(row.original.date) : "—"}
      </span>
    ),
  },
];
