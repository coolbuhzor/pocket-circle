import type { ContributionDisplayStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const labels: Record<ContributionDisplayStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  disputed: "Disputed",
};

const styles: Record<ContributionDisplayStatus, string> = {
  paid: "bg-success/15 text-success",
  pending: "bg-pending/20 text-pending",
  overdue: "bg-danger/15 text-danger",
  disputed: "bg-danger/15 text-danger",
};

export function ContributionStatusBadge({
  status,
}: {
  status: ContributionDisplayStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}
