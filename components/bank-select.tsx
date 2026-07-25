"use client";

import {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import type { Bank } from "@/lib/api/types";

interface BankSelectProps {
  banks: Bank[];
  loading?: boolean;
  value?: string;
  onChange: (bank: Bank | null) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export function BankSelect({
  banks,
  loading = false,
  value,
  onChange,
  label = "Bank",
  error,
  placeholder = "Search for your bank…",
  disabled,
  id,
}: BankSelectProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const listId = `${inputId}-list`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () => banks.find((b) => b.code === value) ?? null,
    [banks, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return banks;
    return banks.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        (b.slug?.toLowerCase().includes(q) ?? false),
    );
  }, [banks, query]);

  function close() {
    setOpen(false);
  }

  useClickOutside(containerRef, close, open);

  function selectBank(bank: Bank) {
    onChange(bank);
    setQuery(bank.name);
    close();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key === "ArrowDown" && !open) {
      setQuery(selected?.name ?? "");
      setOpen(true);
    }
    if (e.key === "Enter" && open && filtered.length === 1) {
      e.preventDefault();
      selectBank(filtered[0]);
    }
  }

  return (
    <div className="flex w-full flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled || loading}
          placeholder={loading ? "Loading banks…" : placeholder}
          value={open ? query : (selected?.name ?? "")}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (selected && e.target.value !== selected.name) {
              onChange(null);
            }
          }}
          onFocus={() => {
            setQuery(selected?.name ?? "");
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className={cn(
            "h-11 w-full rounded-lg border border-primary-light/50 bg-surface py-2 pr-10 pl-3 text-sm text-text placeholder:text-text-muted/70 transition-colors",
            "focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/25",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger focus:border-danger focus:ring-danger/25",
          )}
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-muted">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <ChevronsUpDown className="h-4 w-4" aria-hidden />
          )}
        </span>

        {open && !loading && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-primary-light/40 bg-surface p-1.5 shadow-lg shadow-primary/10"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-text-muted">
                No banks match “{query.trim()}”
              </li>
            ) : (
              filtered.map((bank) => {
                const isSelected = bank.code === value;
                return (
                  <li key={bank.code} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      className={cn(
                        "relative flex w-full cursor-pointer items-center rounded-lg py-2.5 pr-9 pl-3 text-left text-sm text-text outline-none",
                        "hover:bg-primary-light/25 hover:text-primary",
                        isSelected && "font-medium text-primary",
                      )}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectBank(bank)}
                    >
                      {bank.name}
                      {isSelected && (
                        <Check className="absolute right-3 h-4 w-4 text-secondary" />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
      {error && (
        <p className="text-xs text-danger animate-[pc-fade_.2s_ease-out]">
          {error}
        </p>
      )}
    </div>
  );
}
