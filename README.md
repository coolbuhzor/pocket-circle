# Pocket Circle

Frontend for digitising **Ajo** / rotating group savings in Nigeria.

Friends pool money on a schedule; one member (the collector) receives that period’s total; the role rotates. **Pocket Circle does not hold or move money** — it shows whose turn it is, that person’s bank details, and lets members upload proof of payment. Transfers stay bank-to-bank.

Author / maintainer: Senior Developer

## Stack

- Next.js 16 (App Router) + TypeScript + React 19
- Tailwind CSS v4
- TanStack React Query + TanStack Table
- react-hook-form + zod
- lucide-react, recharts
- NestJS backend via a same-origin BFF (httpOnly JWT cookie)
- Vitest (unit) + Playwright (end-to-end)

## Getting started

```bash
pnpm install
cp .env.example .env.local   # set BACKEND_URL (server-only)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

`BACKEND_URL` must **not** use a `NEXT_PUBLIC_` prefix — the browser never talks to the NestJS API directly. Set it to the API **origin only** (no `/api/v1`); the BFF appends the versioned prefix.

The backend should be running separately (default `http://localhost:4001`). See the `pocket-circle-backend` README.

## Environment

| Variable | Where | Purpose |
| --- | --- | --- |
| `BACKEND_URL` | `.env.local` (server-only) | NestJS origin, e.g. `http://localhost:4001` |

## Architecture

```
Browser (UI + React Query)
        │  same-origin fetch
        ▼
Next.js Route Handlers
  /api/auth/*  → login/signup set httpOnly pc_token cookie; return { user } only
                 forgot-password / reset-password are public (no cookie)
  /api/v1/*    → attach Authorization: Bearer from cookie → BACKEND_URL/api/v1/*
                 (public GETs: banks, banks/resolve, invites/:token)
        │
        ▼
NestJS API (BACKEND_URL/api/v1/…)
```

JWT never enters `localStorage`, `sessionStorage`, or client React state.

### Domain model

| Entity | Role |
| --- | --- |
| **User** | Split name, email, bank details, notification prefs |
| **Group** | Contribution amount, frequency, members, payout order |
| **Cycle** | Active period + collector |
| **Contribution** | Receipt + stored `pending` / `confirmed` / `disputed` (UI uses derived `displayStatus`) |
| **ActivityEvent** | Group timeline |
| **Notification** | Per-user inbox |
| **Invite** | Tokenised join links, optional invitee email |

## App routes

| Route | Purpose |
| --- | --- |
| `/` | Landing |
| `/how-it-works` | Trust / product explanation |
| `/architecture` | Architecture diagram |
| `/login`, `/signup` | Auth |
| `/forgot-password` | Request a reset email (demo payload shown) |
| `/reset-password` | Set a new password from `?token=` |
| `/dashboard` | Your groups |
| `/groups/new` | Create group |
| `/groups/[id]` | Overview, members, activity, history, settings |
| `/invite/[token]` | Join via invite |
| `/notifications` | Inbox |
| `/settings` | Profile + bank details |
| `/terms`, `/privacy` | Legal |
| `/admin` | Super admin overview (`isSuperAdmin`) |
| `/admin/users` | Platform users |
| `/admin/groups` | All groups |
| `/admin/insights` | Financial & engagement stats |

## Project structure

```
app/api/             # BFF: auth + /api/v1 catch-all proxy
app/                 # App Router pages
hooks/               # React Query hooks by domain
lib/api/             # client, constants (API_PREFIX), types, server BACKEND_URL
components/          # UI + domain components
e2e/                 # Playwright flows
proxy.ts             # Cookie presence gate for protected pages (Next.js 16)
```

## Scripts

```bash
pnpm dev        # development server
pnpm build      # production build
pnpm start      # run production build
pnpm lint       # eslint
pnpm test       # vitest
pnpm test:e2e   # playwright (starts local API + Next on :3100)
```

## Email (Resend demo mode)

Invite emails and password-reset emails are composed by the backend. **This app runs in Resend demo mode: no real email is delivered.** After a successful send, the UI shows the payload (to, subject, body) with copy buttons, plus a demo-mode banner. Resend test/sandbox keys can only send to the account owner’s verified address.

## Out of scope (by design)

- Wallets, escrow, or payment rails
- Moving money through the app
- Legal enforcement between members
- In-settings password change / leave-group endpoints (reset is via forgot-password email only)
