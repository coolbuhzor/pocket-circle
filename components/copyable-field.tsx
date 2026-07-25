"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/toast";

interface CopyableFieldProps {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}

export function CopyableField({
  label,
  value,
  mono = true,
  className,
}: CopyableFieldProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Could not copy. Try selecting the text instead.", "error");
    }
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-primary-light/40 bg-bg px-3 py-2.5 transition-colors focus-within:border-secondary hover:border-primary-light">
        <span
          className={cn(
            "flex-1 truncate text-sm text-text",
            mono && "font-mono tracking-wide",
          )}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 active:scale-95",
            copied ? "bg-success" : "bg-primary hover:bg-primary/90",
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 animate-[pc-pop_.3s_ease-out]" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
