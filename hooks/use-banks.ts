"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import type { Bank, ResolveAccountResult } from "@/lib/api/types";

function normalizeBanks(payload: unknown): Bank[] {
  if (Array.isArray(payload)) return payload as Bank[];
  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: Bank[] }).data;
  }
  return [];
}

function normalizeResolve(payload: unknown): ResolveAccountResult | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  const accountName =
    (typeof data.accountName === "string" && data.accountName) ||
    (typeof data.account_name === "string" && data.account_name) ||
    null;

  if (!accountName?.trim()) return null;

  return {
    accountName: accountName.trim(),
    accountNumber:
      typeof data.accountNumber === "string"
        ? data.accountNumber
        : typeof data.account_number === "string"
          ? data.account_number
          : undefined,
    bankId: (data.bankId ?? data.bank_id) as string | number | undefined,
  };
}

/** Nigerian bank list — public via BFF; cached client-side for 1 hour. */
export function useBanks() {
  return useQuery({
    queryKey: ["banks"],
    queryFn: async () => normalizeBanks(await apiFetch<unknown>("banks")),
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Resolve NUBAN account name when bank + 10-digit account are ready.
 * Failures are silent (returns null) — callers should not surface errors.
 */
export function useResolveAccount(
  accountNumber: string,
  bankCode: string,
  options?: { enabled?: boolean },
) {
  const ready =
    Boolean(bankCode) && /^\d{10}$/.test(accountNumber) && options?.enabled !== false;

  return useQuery({
    queryKey: ["banks", "resolve", bankCode, accountNumber],
    queryFn: async () => {
      try {
        const qs = new URLSearchParams({ accountNumber, bankCode });
        const json = await apiFetch<unknown>(`banks/resolve?${qs.toString()}`);
        return normalizeResolve(json);
      } catch {
        return null;
      }
    },
    enabled: ready,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
