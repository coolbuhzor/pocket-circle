interface StepIndicatorProps {
  step: number;
  total?: number;
}

export function StepIndicator({ step, total = 2 }: StepIndicatorProps) {
  return (
    <div className="mt-4 flex gap-2" aria-hidden>
      {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
        <div
          key={s}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            s <= step ? "bg-primary" : "bg-primary-light/40"
          }`}
        />
      ))}
    </div>
  );
}
