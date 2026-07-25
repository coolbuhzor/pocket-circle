"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Receipt, ShieldAlert } from "lucide-react";
import { CycleOverviewCard } from "@/components/groups/CycleOverviewCard";
import { ContributionStatusBadge } from "@/components/ContributionStatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { RotationCircle } from "@/components/RotationCircle";
import { DataTable } from "@/components/ui/DataTable";
import type { ContributionDisplayStatus } from "@/lib/api/types";
import { formatNaira } from "@/lib/utils";

export type AdminPaymentRow = {
  userId: string;
  name: string;
  status: ContributionDisplayStatus;
  amount: number | null;
};

export type AdminMemberRow = {
  userId: string;
  payoutOrder: number;
  name: string;
  role: string;
  isCollector: boolean;
  status: ContributionDisplayStatus;
};

const paymentColumns: ColumnDef<AdminPaymentRow, unknown>[] = [
  {
    accessorKey: "name",
    header: "Member",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <ContributionStatusBadge status={row.original.status} />
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-mono text-xs tabular-nums">
        {row.original.amount != null ? formatNaira(row.original.amount) : "—"}
      </span>
    ),
  },
];

const memberColumns: ColumnDef<AdminMemberRow, unknown>[] = [
  {
    accessorKey: "payoutOrder",
    header: "#",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-text-muted">
        {row.original.payoutOrder}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.name}
        {row.original.isCollector && (
          <span className="ml-2 text-xs font-normal text-accent">
            Collector
          </span>
        )}
      </span>
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <ContributionStatusBadge status={row.original.status} />
    ),
  },
];

interface AdminGroupOverviewTabProps {
  cycle: {
    cycleNumber: number;
    periodStart: string;
    periodEnd: string;
    collectorUserId: string;
  } | null;
  rotationMembers: { id: string; name: string }[];
  collector: {
    name?: string;
    bankName?: string | null;
    accountNumber?: string | null;
  } | null;
  paymentRows: AdminPaymentRow[];
}

export function AdminGroupOverviewTab({
  cycle,
  rotationMembers,
  collector,
  paymentRows,
}: AdminGroupOverviewTabProps) {
  if (!cycle) {
    return (
      <EmptyState
        icon={<Receipt className="h-6 w-6" />}
        title="No active cycle"
        message="This group has no active cycle right now."
      />
    );
  }

  return (
    <div className="space-y-5">
      <CycleOverviewCard
        className="rounded-xl border-primary-light/40 shadow-none"
        cycleNumber={cycle.cycleNumber}
        periodStart={cycle.periodStart}
        periodEnd={cycle.periodEnd}
        members={rotationMembers}
        collectorId={cycle.collectorUserId}
        collectorName={collector?.name ?? "Unknown"}
        bankName={collector?.bankName}
        accountNumber={collector?.accountNumber}
      />
      <DataTable
        columns={paymentColumns}
        data={paymentRows}
        getRowId={(row) => row.userId}
        minWidth="480px"
        emptyMessage="No payment rows for this cycle."
      />
    </div>
  );
}

interface AdminGroupMembersTabProps {
  rotationMembers: { id: string; name: string }[];
  collectorUserId?: string;
  memberRows: AdminMemberRow[];
}

export function AdminGroupMembersTab({
  rotationMembers,
  collectorUserId = "",
  memberRows,
}: AdminGroupMembersTabProps) {
  return (
    <div className="space-y-3">
      <div className="mb-4 flex justify-center sm:justify-start">
        <RotationCircle
          members={rotationMembers}
          collectorId={collectorUserId}
          size="sm"
        />
      </div>
      <DataTable
        columns={memberColumns}
        data={memberRows}
        getRowId={(row) => row.userId}
        minWidth="520px"
        emptyMessage="No members yet."
      />
    </div>
  );
}

export function AdminNotMemberBanner() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-text">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      <p>Viewing as admin — you are not a member of this group</p>
    </div>
  );
}
