"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Copy, Landmark } from "lucide-react";
import { RotationCircle } from "@/components/rotation-circle";
import { ContributionStatusBadge } from "@/components/contribution-status-badge";
import { formatNaira, getInitials } from "@/lib/utils";

const CIRCLE = [
  { id: "amaka", name: "Amaka Obi", bank: "GTBank", account: "0123456789" },
  { id: "tunde", name: "Tunde Bello", bank: "Kuda", account: "2044918273" },
  { id: "zainab", name: "Zainab Musa", bank: "Access Bank", account: "0781123400" },
  { id: "chidi", name: "Chidi Eze", bank: "UBA", account: "2119087345" },
  { id: "ife", name: "Ifeoma Nwosu", bank: "Opay", account: "8123045567" },
  { id: "bola", name: "Bola Sanni", bank: "First Bank", account: "3092217640" },
];

const AMOUNT = 50_000;
const STEP_MS = 1800;
const PAYERS = CIRCLE.length - 1;
const STEPS_PER_CYCLE = PAYERS + 2;

export function HeroPreview() {
  const [step, setStep] = useState(3);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setStep((s) => s + 1), STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  const collector = CIRCLE[Math.floor(step / STEPS_PER_CYCLE) % CIRCLE.length];
  const paidCount = Math.min(step % STEPS_PER_CYCLE, PAYERS);
  const payers = CIRCLE.filter((m) => m.id !== collector.id);
  const collected = paidCount * AMOUNT;
  const justPaid = payers[paidCount - 1];

  return (
    <div className="relative">
      <div
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary-light/50 via-secondary/20 to-accent/25 blur-2xl"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-3xl border border-primary-light/40 bg-surface shadow-[0_24px_60px_-24px_rgba(33,28,61,0.35)]">
        <span
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[pc-sheen_6s_ease-in-out_infinite]"
          aria-hidden
        />

        <div className="flex items-center justify-between gap-3 border-b border-primary-light/30 bg-bg/70 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-display text-sm font-semibold text-white">
              SS
            </span>
            <div>
              <p className="text-sm font-semibold text-text">Sunday Squad</p>
              <p className="font-mono text-xs text-text-muted">
                6 members · {formatNaira(AMOUNT)}/mo
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-xs font-medium text-success">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success animate-[pc-ring_2s_ease-out_infinite]" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Cycle 7 live
          </span>
        </div>

        <div className="flex flex-col items-center gap-5 px-5 py-6 sm:flex-row sm:items-center">
          <RotationCircle
            members={CIRCLE}
            collectorId={collector.id}
            size="md"
            className="shrink-0"
          />
          <div className="w-full space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Whose turn
              </p>
              <p
                key={collector.id}
                className="font-display text-xl font-semibold text-text animate-[pc-pop_.5s_ease-out]"
              >
                {collector.name}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl border border-primary-light/40 bg-bg px-3 py-2.5">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Landmark className="h-3.5 w-3.5" />
                  {collector.bank}
                </p>
                <p className="mt-0.5 truncate font-mono text-sm font-medium text-text">
                  {collector.account}
                </p>
              </div>
              <span className="rounded-lg bg-surface p-2 text-primary shadow-sm">
                <Copy className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 border-t border-primary-light/30 px-5 py-4">
          {payers.slice(0, 3).map((payer, index) => (
            <div
              key={payer.id}
              className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 transition-colors duration-500"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light/50 text-[11px] font-semibold text-primary">
                  {getInitials(payer.name)}
                </span>
                <span className="text-sm font-medium text-text">
                  {payer.name}
                </span>
              </div>
              <ContributionStatusBadge
                status={index < paidCount ? "paid" : "pending"}
              />
            </div>
          ))}
        </div>

        <div className="border-t border-primary-light/30 bg-bg/60 px-5 py-4">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Collected this cycle
            </p>
            <p className="font-mono text-sm font-semibold tabular-nums text-primary">
              {formatNaira(collected)}
            </p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary-light/35">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-700 ease-out"
              style={{ width: `${(paidCount / PAYERS) * 100}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-[11px] text-text-muted">
            {paidCount} of {PAYERS} paid · payout {formatNaira(AMOUNT * PAYERS)}
          </p>
        </div>
      </div>

      <div
        key={justPaid?.id ?? "idle"}
        className="absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-2xl border border-primary-light/40 bg-surface px-3.5 py-2.5 shadow-lg animate-[pc-pop_.5s_ease-out] sm:flex"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15 text-success">
          <BadgeCheck className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold text-text">
            {justPaid ? `${justPaid.name.split(" ")[0]}’s receipt` : "New cycle"}
          </p>
          <p className="text-[11px] text-text-muted">
            {justPaid ? "Confirmed by collector" : "Handed off automatically"}
          </p>
        </div>
      </div>

      <div className="absolute -right-4 top-16 hidden rounded-2xl border border-primary-light/40 bg-surface px-3.5 py-2.5 shadow-lg animate-[pc-float_5s_ease-in-out_infinite] lg:block">
        <p className="text-[11px] text-text-muted">Money moves</p>
        <p className="text-xs font-semibold text-text">Bank → bank</p>
        <p className="mt-0.5 text-[11px] font-medium text-accent">
          Never through us
        </p>
      </div>
    </div>
  );
}
