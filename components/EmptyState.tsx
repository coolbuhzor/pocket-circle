import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary-light/60 bg-surface px-6 py-14 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light/30 text-primary">
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold text-text">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-text-muted">{message}</p>
      {actionLabel && (onAction || actionHref) && (
        <div className="mt-6">
          {actionHref ? (
            <Link href={actionHref}>
              <Button>{actionLabel}</Button>
            </Link>
          ) : (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
        </div>
      )}
    </div>
  );
}
