"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function Select({
  className,
  label,
  error,
  id,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  placeholder = "Select…",
}: SelectProps) {
  const selectId = id ?? name;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        name={name}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={selectId}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-primary-light/50 bg-surface px-3 text-left text-sm text-text transition-colors",
            "hover:border-primary-light focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/25",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-placeholder:text-text-muted/70",
            error && "border-danger focus:border-danger focus:ring-danger/25",
            className,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={6}
            className={cn(
              "z-50 overflow-hidden rounded-xl border border-primary-light/40 bg-surface shadow-lg shadow-primary/10",
              "w-(--radix-select-trigger-width)",
            )}
          >
            <SelectPrimitive.Viewport className="p-1.5">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-9 text-sm text-text outline-none",
                    "data-highlighted:bg-primary-light/25 data-highlighted:text-primary",
                    "data-[state=checked]:font-medium data-[state=checked]:text-primary",
                    "data-disabled:pointer-events-none data-disabled:opacity-50",
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {opt.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-3 flex items-center">
                    <Check className="h-4 w-4 text-secondary" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
