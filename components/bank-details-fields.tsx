"use client";

import { Loader2 } from "lucide-react";
import { BankSelect } from "@/components/bank-select";
import { Input } from "@/components/ui/input";
import { useBanks, useResolveAccount } from "@/hooks/use-banks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { accountNameMatchesUser } from "@/lib/bank-name-match";

interface BankDetailsFieldsProps {
  bankCode: string;
  accountNumber: string;
  onBankChange: (bank: { code: string; name: string } | null) => void;
  onAccountNumberChange: (value: string) => void;
  /** When set, resolve result is compared for an advisory (non-blocking) match hint. */
  expectedName?: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  bankError?: string;
  accountError?: string;
}

const RESOLVE_DEBOUNCE_MS = 450;

export function BankDetailsFields({
  bankCode,
  accountNumber,
  onBankChange,
  onAccountNumberChange,
  expectedName,
  bankError,
  accountError,
}: BankDetailsFieldsProps) {
  const { data: banks = [], isLoading: banksLoading } = useBanks();

  const debouncedAccount = useDebouncedValue(accountNumber, RESOLVE_DEBOUNCE_MS);
  const debouncedBankCode = useDebouncedValue(bankCode, RESOLVE_DEBOUNCE_MS);

  const resolveReady =
    Boolean(debouncedBankCode) && /^\d{10}$/.test(debouncedAccount);

  const {
    data: resolved,
    isFetching: resolving,
    isFetched,
  } = useResolveAccount(debouncedAccount, debouncedBankCode, {
    enabled: resolveReady,
  });

  const accountName = resolved?.accountName ?? null;

  const nameReady = Boolean(
    expectedName?.firstName?.trim() && expectedName?.lastName?.trim(),
  );

  const matches =
    accountName && nameReady && expectedName
      ? accountNameMatchesUser(accountName, expectedName)
      : null;

  return (
    <div className="space-y-4">
      <BankSelect
        banks={banks}
        loading={banksLoading}
        value={bankCode || undefined}
        onChange={(bank) =>
          onBankChange(bank ? { code: bank.code, name: bank.name } : null)
        }
        error={bankError}
      />

      <div>
        <Input
          label="Account number"
          inputMode="numeric"
          autoComplete="off"
          className="font-mono"
          value={accountNumber}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
            onAccountNumberChange(digits);
          }}
          error={accountError}
        />
        {resolveReady && resolving && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-text-muted">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
            Looking up account name…
          </p>
        )}
        {resolveReady && isFetched && !resolving && !accountName && (
          <p className="mt-1.5 text-xs text-text-muted animate-[pc-fade_.2s_ease-out]">
            Couldn&apos;t look up this account right now. You can still continue.
          </p>
        )}
        {accountName && matches !== false && (
          <p className="mt-1.5 text-xs font-medium text-text animate-[pc-fade_.2s_ease-out]">
            Account name:{" "}
            <span className="uppercase tracking-wide">{accountName}</span>
          </p>
        )}
        {accountName && matches === false && (
          <p className="mt-1.5 text-xs text-text-muted animate-[pc-fade_.2s_ease-out]">
            Account name{" "}
            <span className="font-medium uppercase tracking-wide">
              {accountName}
            </span>{" "}
            looks different from the name you entered. Double-check if you can —
            you can still continue.
          </p>
        )}
      </div>
    </div>
  );
}
