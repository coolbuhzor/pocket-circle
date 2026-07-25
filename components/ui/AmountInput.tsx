"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn, formatAmountInput, parseAmountInput } from "@/lib/utils";

interface AmountInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange" | "inputMode"
  > {
  label?: string;
  error?: string;
  hint?: string;
  value: number | undefined | null;
  onChange: (value: number | undefined) => void;
}

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      id,
      value,
      onChange,
      onBlur,
      name,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={formatAmountInput(value)}
          onChange={(e) => onChange(parseAmountInput(e.target.value))}
          onBlur={onBlur}
          className={cn(
            "h-11 w-full rounded-lg border border-primary-light/50 bg-surface px-3 font-mono text-sm tabular-nums text-text placeholder:text-text-muted/70 transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/25 disabled:opacity-50",
            error && "border-danger focus:border-danger focus:ring-danger/25",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {!error && hint && (
          <p className="text-xs text-text-muted">{hint}</p>
        )}
      </div>
    );
  },
);

AmountInput.displayName = "AmountInput";
