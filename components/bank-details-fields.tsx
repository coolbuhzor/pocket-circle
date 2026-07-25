"use client";

import { Loader2 } from "lucide-react";
import { BankSelect } from "@/components/bank-select";
import { Input } from "@/components/ui/input";
import { useBanks, useResolveAccount } from "@/hooks/use-banks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface BankDetailsFieldsProps {
  bankCode: string;
  accountNumber: string;
  onBankChange: (bank: { code: string; name: string } | null) => void;
  onAccountNumberChange: (value: string) => void;
  bankError?: string;
  accountError?: string;
}

const RESOLVE_DEBOUNCE_MS = 450;

export function BankDetailsFields({
  bankCode,
  accountNumber,
  onBankChange,
  onAccountNumberChange,
  bankError,
  accountError,
}: BankDetailsFieldsProps) {
  const { data: banks = [], isLoading: banksLoading } = useBanks();

  const debouncedAccount = useDebouncedValue(accountNumber, RESOLVE_DEBOUNCE_MS);
  const debouncedBankCode = useDebouncedValue(bankCode, RESOLVE_DEBOUNCE_MS);

  const resolveReady =
    Boolean(debouncedBankCode) && /^\d{10}$/.test(debouncedAccount);

  const { data: resolved, isFetching: resolving } = useResolveAccount(
    debouncedAccount,
    debouncedBankCode,
    { enabled: resolveReady },
  );

  const accountName = resolved?.accountName;

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
        {resolveReady && !resolving && accountName && (
          <p className="mt-1.5 text-xs font-medium text-text animate-[pc-fade_.2s_ease-out]">
            Account name:{" "}
            <span className="uppercase tracking-wide">{accountName}</span>
          </p>
        )}
      </div>
    </div>
  );
}
