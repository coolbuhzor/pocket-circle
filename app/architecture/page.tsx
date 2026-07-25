import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ArchitecturePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href="/how-it-works"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        How it works
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-text">
        Architecture
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
        Frontend-only today, with a mock data layer shaped like a future API.
        Money never enters the system — banks stay outside the boundary.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-primary-light/30 bg-surface p-4 shadow-sm sm:p-6">
        <pre className="font-mono text-[11px] leading-relaxed text-text sm:text-xs whitespace-pre overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────┐
│                        Browser (Next.js)                    │
│  Pages · Components · Auth context · Toast · react-hook-form│
└─────────────────────────────┬───────────────────────────────┘
                              │ async calls (same shape as API)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   lib/mock-data/ (swap later)               │
│  Users · Groups · Cycles · Contributions · Activity         │
│  Notifications · Invites · confirm / dispute / handoff      │
└─────────────────────────────┬───────────────────────────────┘
                              │ (future)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Real backend + DB (not built yet)              │
└─────────────────────────────────────────────────────────────┘

        Money path (always outside Pocket Circle)
   Member bank ──────────────────────────────► Collector bank
                         bank-to-bank transfer
`}
        </pre>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">App layers</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-muted">
            <li>
              <span className="font-medium text-text">app/</span> — routes
              (landing, auth, dashboard, groups, invite, settings, notifications)
            </li>
            <li>
              <span className="font-medium text-text">components/</span> — UI
              primitives + domain widgets (RotationCircle, CyclePaymentsPanel)
            </li>
            <li>
              <span className="font-medium text-text">lib/mock-data/</span> —
              typed seed + Promise-based accessors
            </li>
            <li>
              <span className="font-medium text-text">lib/auth.tsx</span> — mock
              session via localStorage
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-primary-light/30 bg-surface p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Domain loop</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-muted">
            <li>Group has members in payout order</li>
            <li>Active cycle names one collector</li>
            <li>Members upload receipts → pending</li>
            <li>Collector confirms / disputes / nudges</li>
            <li>Admin or collector closes cycle → next collector</li>
            <li>Activity + notifications mirror every change</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-primary-light/30 bg-bg p-5">
        <h2 className="font-display text-lg font-semibold">Mermaid</h2>
        <p className="mt-1 text-sm text-text-muted">
          Same diagram as in the README — paste into any Mermaid renderer.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-primary p-4 font-mono text-[11px] leading-relaxed text-primary-light sm:text-xs">
{`flowchart TB
  subgraph Client["Next.js App Router"]
    UI[Pages + Components]
    Auth[Mock Auth Context]
    UI --> Auth
  end

  subgraph Mock["lib/mock-data"]
    API[Async accessors]
    Seed[(In-memory seed)]
    API --> Seed
  end

  subgraph Outside["Outside the app"]
    Banks[Member ↔ Collector banks]
    WA[WhatsApp share / nudge]
  end

  UI -->|getGroups / submitReceipt / confirm…| API
  UI -->|wa.me links| WA
  Banks -.->|no money through Pocket Circle| UI`}
        </pre>
      </div>
    </div>
  );
}
