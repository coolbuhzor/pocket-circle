import { BadgeCheck } from "lucide-react";
import { RotationCircle } from "@/components/rotation-circle";
import { CopyableField } from "@/components/copyable-field";
import { cn, formatDate } from "@/lib/utils";

interface CycleOverviewCardProps {
  cycleNumber: number;
  periodStart: string;
  periodEnd: string;
  members: { id: string; name: string }[];
  collectorId: string;
  collectorName: string;
  bankName?: string | null;
  accountNumber?: string | null;
  bankVerified?: boolean | null;
  size?: "sm" | "md";
  className?: string;
}

export function CycleOverviewCard({
  cycleNumber,
  periodStart,
  periodEnd,
  members,
  collectorId,
  collectorName,
  bankName,
  accountNumber,
  bankVerified,
  size = "md",
  className,
}: CycleOverviewCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
        Cycle {cycleNumber} · {formatDate(periodStart)} – {formatDate(periodEnd)}
      </p>
      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <RotationCircle
          members={members}
          collectorId={collectorId}
          size={size}
        />
        <div className="w-full flex-1 space-y-4">
          <div>
            <p className="text-sm text-text-muted">Whose turn</p>
            <p className="font-display text-2xl font-semibold text-text">
              {collectorName}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Bank
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm font-medium text-text">
              <span>{bankName ?? "—"}</span>
              {bankVerified && (
                <span
                  className="inline-flex items-center gap-0.5 text-xs font-medium text-secondary"
                  title="Bank account verified"
                >
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                  Verified
                </span>
              )}
            </p>
          </div>
          <CopyableField
            label="Account number"
            value={accountNumber ?? "—"}
          />
        </div>
      </div>
    </div>
  );
}
