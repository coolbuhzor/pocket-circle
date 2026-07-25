import type { InviteEffectiveStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const labels: Record<InviteEffectiveStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  expired: "Expired",
};

const styles: Record<InviteEffectiveStatus, string> = {
  pending: "bg-pending/20 text-pending",
  accepted: "bg-success/15 text-success",
  expired: "bg-primary-light/30 text-text-muted",
};

export function InviteStatusPill({
  status,
}: {
  status: InviteEffectiveStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold capitalize",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}
