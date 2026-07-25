"use client";

import { forwardRef } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps
  extends Omit<CheckboxPrimitive.CheckboxProps, "asChild"> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    const checkboxId = id ?? props.name;
    const control = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          "peer flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border border-primary-light/60 bg-surface transition-colors",
          "hover:border-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/25",
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-danger",
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    if (!label && !description) {
      return control;
    }

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 text-sm text-text transition-colors hover:bg-bg has-disabled:cursor-not-allowed has-disabled:opacity-50"
        >
          {control}
          <span className="flex flex-col gap-0.5">
            {label}
            {description && (
              <span className="text-xs text-text-muted">{description}</span>
            )}
          </span>
        </label>
        {error && <p className="pl-2 text-xs text-danger">{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
