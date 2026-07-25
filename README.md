# Pocket Circle

Frontend for digitising **Ajo** / rotating group savings in Nigeria.

Friends pool money monthly; one member (the collector) receives that month’s total; the role rotates. **Pocket Circle does not hold or move money** — it shows whose turn it is, that person’s bank details, and lets members upload proof of payment. Transfers stay bank-to-bank.

## Stack

- Next.js 16 (App Router) + TypeScript + React 19
- Tailwind CSS v4
- TanStack React Query
- react-hook-form + zod
- lucide-react
- NestJS backend via a same-origin BFF (httpOnly JWT cookie)

## Getting started

```bash
pnpm install
cp .env.example .env.local   # set BACKEND_URL (server-only)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

`BACKEND_URL` must **not** use a `NEXT_PUBLIC_` prefix — the browser never talks to the NestJS API directly. Set it to the API **origin only** (no `/api/v1`); the BFF appends the versioned prefix.

## Architecture

```
Browser (UI + React Query)
        │  same-origin fetch
        ▼
Next.js Route Handlers
  /api/auth/*  → login/signup set httpOnly pc_token cookie; return { user } only
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
| **User** | Name, email, bank details |
| **Group** | Contribution amount, members, payout order |
| **Cycle** | Active month + collector |
| **Contribution** | Receipt + stored `pending` / `confirmed` / `disputed` (UI uses derived `displayStatus`) |
| **ActivityEvent** | Group timeline |
| **Notification** | Per-user inbox |
| **Invite** | Tokenised join links |

## App routes

| Route | Purpose |
| --- | --- |
| `/` | Landing |
| `/how-it-works` | Trust / product explanation |
| `/architecture` | Architecture diagram |
| `/login`, `/signup` | Auth |
| `/dashboard` | Your groups |
| `/groups/new` | Create group |
| `/groups/[id]` | Overview, members, activity, history, settings |
| `/invite/[token]` | Join via invite |
| `/notifications` | Inbox |
| `/settings` | Profile + bank details |
| `/admin` | Super admin overview (`isSuperAdmin`) |
| `/admin/users` | Platform users |
| `/admin/groups` | All groups |
| `/admin/insights` | Financial & engagement stats |

## Project structure

```
app/api/             # BFF: auth + /api/v1 catch-all proxy
hooks/               # React Query hooks by domain
lib/api/             # client, constants (API_PREFIX), types, server BACKEND_URL
components/          # UI + domain components
proxy.ts             # Cookie presence gate for protected pages (Next.js 16)
```

## Scripts

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # eslint
```

## Out of scope (by design)

- Wallets, escrow, or payment rails
- Moving money through the app
- Legal enforcement between members
- Password change / leave-group endpoints (not on the backend yet)
