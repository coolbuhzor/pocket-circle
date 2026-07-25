"use client";

import { Download, Share2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { ContributionStatusBadge } from "@/components/ContributionStatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import type { ContributionDisplayStatus } from "@/lib/api/types";
import { formatDate, formatNaira } from "@/lib/utils";
import { useToast } from "@/components/Toast";

interface SummaryRow {
  name: string;
  status: ContributionDisplayStatus;
  amount?: number;
}

interface CycleSummaryExportProps {
  groupName: string;
  cycleNumber: number;
  periodStart: string;
  periodEnd: string;
  collectorName: string;
  contributionAmount: number;
  rows: SummaryRow[];
}

const columns: ColumnDef<SummaryRow, unknown>[] = [
  {
    accessorKey: "name",
    header: "Member",
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
    cell: ({ row }) => (
      <span className="font-mono text-text-muted">
        {row.original.amount ? formatNaira(row.original.amount) : "—"}
      </span>
    ),
  },
];

export function CycleSummaryExport({
  groupName,
  cycleNumber,
  periodStart,
  periodEnd,
  collectorName,
  contributionAmount,
  rows,
}: CycleSummaryExportProps) {
  const { toast } = useToast();

  function buildText() {
    const lines = [
      `${groupName} — Cycle ${cycleNumber}`,
      `Collector: ${collectorName}`,
      `Period: ${formatDate(periodStart)} – ${formatDate(periodEnd)}`,
      `Amount: ${formatNaira(contributionAmount)}`,
      "",
      "Who paid:",
      ...rows.map(
        (r) =>
          `• ${r.name}: ${r.status.toUpperCase()}${r.amount ? ` (${formatNaira(r.amount)})` : ""}`,
      ),
      "",
      "Shared from Pocket Circle",
    ];
    return lines.join("\n");
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(buildText());
      toast("Summary copied");
    } catch {
      toast("Could not copy summary", "error");
    }
  }

  function shareWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(buildText())}`,
      "_blank",
    );
  }

  function downloadTxt() {
    const blob = new Blob([buildText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${groupName.replace(/\s+/g, "-").toLowerCase()}-cycle-${cycleNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Summary downloaded");
  }

  const paid = rows.filter((r) => r.status === "paid").length;

  return (
    <div className="rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-text">
            Cycle summary
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {paid}/{rows.length} paid · share with the group chat
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={copySummary}>
            Copy
          </Button>
          <Button size="sm" variant="secondary" onClick={shareWhatsApp}>
            <Share2 className="h-3.5 w-3.5" />
            WhatsApp
          </Button>
          <Button size="sm" variant="ghost" onClick={downloadTxt}>
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => row.name}
          minWidth="320px"
          className="rounded-xl"
          emptyMessage="No payment rows yet."
        />
      </div>
    </div>
  );
}
