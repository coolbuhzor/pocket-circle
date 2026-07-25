import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const areaId = id ?? props.name;
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={areaId} className="text-sm font-medium text-text">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          className={cn(
            "min-h-24 w-full rounded-lg border border-primary-light/50 bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted/70 transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/25 disabled:opacity-50",
            error && "border-danger focus:border-danger focus:ring-danger/25",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
