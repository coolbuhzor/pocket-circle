"use client";

import { forwardRef } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export const RadioGroup = forwardRef<
  HTMLDivElement,
  RadioGroupPrimitive.RadioGroupProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends RadioGroupPrimitive.RadioGroupItemProps {
  label?: string;
  description?: string;
}

export const RadioGroupItem = forwardRef<
  HTMLButtonElement,
  RadioGroupItemProps
>(({ className, label, description, id, ...props }, ref) => {
  const itemId = id ?? props.value;
  const control = (
    <RadioGroupPrimitive.Item
      ref={ref}
      id={itemId}
      className={cn(
        "peer flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-primary-light/60 bg-surface transition-colors",
        "hover:border-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/25",
        "data-[state=checked]:border-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center after:h-2.5 after:w-2.5 after:rounded-full after:bg-primary" />
    </RadioGroupPrimitive.Item>
  );

  if (!label && !description) {
    return control;
  }

  return (
    <label
      htmlFor={itemId}
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
  );
});
RadioGroupItem.displayName = "RadioGroupItem";
