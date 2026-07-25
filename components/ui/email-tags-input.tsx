"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmailTagsInputProps {
  label?: string;
  hint?: string;
  emails: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
  className?: string;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function EmailTagsInput({
  label = "Invite by email",
  hint,
  emails,
  onChange,
  placeholder = "friend@email.com",
  className,
}: EmailTagsInputProps) {
  const inputId = useId();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  function addEmail() {
    const next = draft.trim().toLowerCase();
    if (!next) {
      setError(null);
      return;
    }
    if (!isValidEmail(next)) {
      setError("Enter a valid email address");
      return;
    }
    if (emails.some((e) => e.toLowerCase() === next)) {
      setError("That email is already added");
      return;
    }
    onChange([...emails, next]);
    setDraft("");
    setError(null);
  }

  function removeEmail(email: string) {
    onChange(emails.filter((e) => e !== email));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
    if (e.key === "Backspace" && !draft && emails.length > 0) {
      removeEmail(emails[emails.length - 1]);
    }
  }

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}

      <div
        className={cn(
          "rounded-xl border border-primary-light/50 bg-surface p-2 transition-colors",
          "focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/25",
          error &&
            "border-danger focus-within:border-danger focus-within:ring-danger/25",
        )}
      >
        {emails.length > 0 && (
          <ul className="mb-2 flex flex-wrap gap-1.5">
            {emails.map((email) => (
              <li key={email}>
                <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-primary-light/35 py-1 pl-3 pr-1 text-xs font-medium text-primary">
                  <span className="truncate">{email}</span>
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-primary/70 transition-colors hover:bg-primary/10 hover:text-primary"
                    aria-label={`Remove ${email}`}
                  >
                    <X className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2">
          <input
            id={inputId}
            type="email"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="h-9 min-w-0 flex-1 bg-transparent px-2 text-sm text-text placeholder:text-text-muted/70 focus:outline-none"
            autoComplete="email"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="shrink-0"
            disabled={!draft.trim()}
            onClick={addEmail}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-danger animate-[pc-fade_.2s_ease-out]">
          {error}
        </p>
      )}
      {!error && hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
}
