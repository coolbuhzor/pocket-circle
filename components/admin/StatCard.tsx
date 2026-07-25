interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-primary-light/40 bg-surface px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>
      <p className="mt-2 font-mono text-2xl font-semibold text-primary tabular-nums">
        {value}
      </p>
    </div>
  );
}
