"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, type, ...props }, ref) => {
    const inputId = id ?? props.name;
    const isPassword = type === "password";
    const [visible, setVisible] = useState(false);
    const resolvedType = isPassword ? (visible ? "text" : "password") : type;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={cn(
              "h-11 w-full rounded-lg border border-primary-light/50 bg-surface px-3 text-sm text-text placeholder:text-text-muted/70 transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/25 disabled:opacity-50",
              isPassword && "pr-11",
              error && "border-danger focus:border-danger focus:ring-danger/25",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1.5 text-text-muted transition-colors hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-danger animate-[pc-fade_.2s_ease-out]">
            {error}
          </p>
        )}
        {!error && hint && (
          <p className="text-xs text-text-muted">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
