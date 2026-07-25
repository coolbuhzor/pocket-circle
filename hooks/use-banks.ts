"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api/client";
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

async function fetchBanksPublic(): Promise<Bank[]> {
  const res = await fetch("/api/banks");
  if (!res.ok) {
    throw new ApiError(res.status, "Could not load banks");
  }
  const json: unknown = await res.json();
  return normalizeBanks(json);
}

async function fetchBanksAuthed(): Promise<Bank[]> {
  const json = await apiFetch<unknown>("banks");
  return normalizeBanks(json);
}

async function resolveAccountPublic(
  accountNumber: string,
  bankCode: string,
): Promise<ResolveAccountResult | null> {
  const qs = new URLSearchParams({ accountNumber, bankCode });
  const res = await fetch(`/api/banks/resolve?${qs.toString()}`);
  if (!res.ok) return null;
  const json: unknown = await res.json();
  return normalizeResolve(json);
}

async function resolveAccountAuthed(
  accountNumber: string,
  bankCode: string,
): Promise<ResolveAccountResult | null> {
  try {
    const qs = new URLSearchParams({ accountNumber, bankCode });
    const json = await apiFetch<unknown>(`banks/resolve?${qs.toString()}`);
    return normalizeResolve(json);
  } catch {
    return null;
  }
}

/**
 * Fetch Nigerian bank list once. Uses the public BFF by default (signup);
 * pass `authenticated` when a session cookie is available.
 */
export function useBanks(options?: { authenticated?: boolean }) {
  const authenticated = options?.authenticated ?? false;

  return useQuery({
    queryKey: ["banks", authenticated ? "auth" : "public"],
    queryFn: authenticated ? fetchBanksAuthed : fetchBanksPublic,
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
  options?: { authenticated?: boolean; enabled?: boolean },
) {
  const authenticated = options?.authenticated ?? false;
  const ready =
    Boolean(bankCode) && /^\d{10}$/.test(accountNumber) && options?.enabled !== false;

  return useQuery({
    queryKey: ["banks", "resolve", bankCode, accountNumber, authenticated],
    queryFn: () =>
      authenticated
        ? resolveAccountAuthed(accountNumber, bankCode)
        : resolveAccountPublic(accountNumber, bankCode),
    enabled: ready,
    staleTime: 5 * 60 * 1000,
    retry: false,
    // Debounce: wait until the query has been enabled for a beat before fetching.
    // React Query refetchOnMount + enabled flip handles most cases; we also
    // rely on the account field only flipping to 10 digits once "complete".
  });
}
