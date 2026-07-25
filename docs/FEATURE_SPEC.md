# Pocket Circle — Feature Specification (Frontend Contract)

**Product principle:** Pocket Circle coordinates Ajo/rotating savings. It does **not** hold, move, or escrow money. Transfers are always bank-to-bank outside the app.

This document is the source of truth for the MVP backend. Field-level parity lives in `lib/mock-data/types.ts` and `lib/mock-data/index.ts`.

---

## 1. Domain entities

| Entity | Fields | Notes |
| --- | --- | --- |
| **User** | `id`, `name`, `email`, `password` (auth only), `bankName`, `accountNumber`, `notifyEmail`, `notifyWhatsApp` | Bank details shown when user is collector |
| **Group** | `id`, `name`, `contributionAmount`, `frequency` (`monthly` only for now), `members[]`, `createdAt` | |
| **GroupMember** | `userId`, `role` (`admin` \| `member`), `payoutOrder` | Rotation order = ascending `payoutOrder` |
| **Cycle** | `id`, `groupId`, `cycleNumber`, `collectorUserId`, `periodStart`, `periodEnd`, `status` (`active` \| `completed`) | One active cycle per group |
| **Contribution** | `id`, `cycleId`, `payerUserId`, `amount`, `receiptUrl?`, `note?`, `status` (`pending` \| `confirmed` \| `disputed`), `disputeReason?`, `submittedAt?`, `reviewedAt?`, `reviewedByUserId?` | Collector does not contribute to own cycle (UI excludes them from payer list) |
| **Invite** | `token`, `groupId`, `invitedByUserId`, `expiresAt`, `status` (`active` \| `expired` \| `accepted`) | |
| **ActivityEvent** | `id`, `groupId`, `type`, `actorUserId`, `targetUserId?`, `cycleId?`, `message`, `createdAt` | Group timeline |
| **Notification** | `id`, `userId`, `groupId?`, `type`, `title`, `body`, `href?`, `read`, `createdAt` | Per-user inbox |

### Derived contribution display status (computed, not stored)

| Status | Rule |
| --- | --- |
| `paid` | Contribution `confirmed` |
| `disputed` | Contribution `disputed` |
| `pending` | Contribution `pending`, or no contribution and period not ended |
| `overdue` | No contribution and `now > periodEnd` |

---

## 2. Auth & account

| Feature | Behavior |
| --- | --- |
| **Sign up** | Name, email, password (min 8), bank name, account number (10 digits). Defaults: `notifyEmail=true`, `notifyWhatsApp=true` |
| **Log in** | Email + password |
| **Session** | Authenticated user required for app pages (except landing, how-it-works, architecture, invite view, login/signup) |
| **Update profile** | Edit name, email, bank name, account number, notification prefs |
| **Log out** | Clear session |

---

## 3. Groups

| Feature | Who | Behavior |
| --- | --- | --- |
| **List my groups** | Member | Cards: name, member count, amount, whose turn (rotation circle), next payout date (`periodEnd`), my contribution status |
| **Create group** | Authenticated | Name, amount, frequency=`monthly`; creator = admin, payoutOrder=1; optional invite-by-email (existing users only); auto-create **cycle 1** with creator as collector |
| **View group** | Member only | Non-members → not found |
| **Update group settings** | Admin | Name, contribution amount, frequency |
| **Delete group** | Admin | Permanent delete |
| **Empty state** | — | “No groups yet — create one…” |

---

## 4. Members & roles

| Feature | Who | Behavior |
| --- | --- | --- |
| **List members** | Member | Rotation order, role, paid/pending/overdue/disputed, collector highlight |
| **Reorder members** | Admin | Move up/down → rewrite `payoutOrder` |
| **Make admin** | Admin | Set `role=admin` (multiple admins allowed) |
| **Remove member** | Admin | Cannot remove self via UI; renumber payout order |
| **Rotation circle** | — | Avatars in circle; current collector highlighted |

---

## 5. Cycles & handoff

| Feature | Who | Behavior |
| --- | --- | --- |
| **Active cycle** | Member | Show cycle number, period, collector name + bank + account number |
| **Copy account number** | Member | Clipboard copy |
| **Close cycle & start next** | Collector or admin | Mark active cycle `completed`; create next cycle; next collector = next in `payoutOrder` (wraps); notify all members |
| **Cycle history** | Member | Table of completed cycles: number, collector, period, paid count |

---

## 6. Contributions / receipts

| Feature | Who | Behavior |
| --- | --- | --- |
| **Upload receipt** | Non-collector member | File (image/PDF), amount, optional note → status `pending`; replaces prior submission for that cycle |
| **Re-upload after dispute** | Payer | Same endpoint; resets to `pending` |
| **Share to WhatsApp** | Payer (after upload) | Prefills confirmation text via `wa.me` (client-side; backend may only store receipt) |
| **Confirm payment** | Collector | `pending`/`disputed` → `confirmed`; set reviewer + timestamp |
| **Flag / dispute** | Collector | Requires reason → `disputed` + `disputeReason` |
| **Collector desk** | Collector | List payers with status; confirm / flag / nudge |

---

## 7. Reminders (nudges)

| Feature | Who | Behavior |
| --- | --- | --- |
| **Send reminder** | Collector | For unpaid/overdue members with no receipt; creates activity + notification for target; frontend opens WhatsApp with prefilled text |

---

## 8. Invites

| Feature | Who | Behavior |
| --- | --- | --- |
| **Generate invite link** | Admin | Create token (~30 day expiry); return shareable URL |
| **View invite** | Anyone | Show group name, inviter, amount; expired/missing → clear error |
| **Accept invite** | Authenticated | Add as `member` at end of payout order; mark invite `accepted`; notify inviter. Unauthenticated → redirect login/signup with `?next=` |

---

## 9. Activity feed

Group-scoped timeline. Types:

- `member_joined`
- `receipt_uploaded`
- `payment_confirmed`
- `payment_disputed`
- `reminder_sent`
- `cycle_started`
- `cycle_completed`
- `turn_changed`

Each event has actor, optional target, optional cycle, human-readable `message`.

---

## 10. Notifications

| Feature | Behavior |
| --- | --- |
| **Inbox** | List for current user, newest first |
| **Unread count** | Badge in nav |
| **Mark one read** | On open |
| **Mark all read** | Bulk |
| **Types** | `your_turn`, `receipt_uploaded`, `payment_confirmed`, `payment_disputed`, `reminder`, `invite_accepted`, `cycle_started` |

### Side effects to emit (backend should mirror)

| Action | Activity | Notifications |
| --- | --- | --- |
| Upload receipt | `receipt_uploaded` | Collector ← receipt uploaded |
| Confirm | `payment_confirmed` | Payer ← confirmed |
| Dispute | `payment_disputed` | Payer ← flagged + reason |
| Nudge | `reminder_sent` | Target ← reminder |
| Close cycle | `cycle_completed` + `cycle_started` + `turn_changed` | New collector ← `your_turn`; others ← `cycle_started` |
| Accept invite | `member_joined` | Inviter ← `invite_accepted` |

---

## 11. Cycle summary / export

| Feature | Behavior |
| --- | --- |
| **Cycle summary** | For active cycle: each non-collector member + display status + amount |
| **Export** | Frontend copy / WhatsApp / `.txt` download (backend can also expose `GET /cycles/:id/summary`) |

---

## 12. Marketing / static (no auth API needed)

- Landing (`/`)
- How it works (`/how-it-works`)
- Architecture (`/architecture`)
- 404 + error boundary

---

## 13. Suggested API surface (maps 1:1 to mock layer)

```
Auth
  POST   /auth/signup
  POST   /auth/login
  POST   /auth/logout
  GET    /me
  PATCH  /me

Users
  GET    /users?ids=

Groups
  GET    /groups                    # mine
  POST   /groups
  GET    /groups/:id
  PATCH  /groups/:id
  DELETE /groups/:id
  POST   /groups/:id/members/reorder   # orderedUserIds[]
  DELETE /groups/:id/members/:userId
  POST   /groups/:id/members/:userId/make-admin

Cycles
  GET    /groups/:id/cycles
  GET    /groups/:id/cycles/active
  POST   /groups/:id/cycles/close      # close active + start next
  GET    /cycles/:id/summary

Contributions
  GET    /cycles/:id/contributions
  POST   /cycles/:id/contributions     # upload receipt (multipart)
  POST   /contributions/:id/confirm
  POST   /contributions/:id/dispute    # { reason }
  GET    /cycles/:id/members/:userId/status  # derived display status

Reminders
  POST   /cycles/:id/reminders         # { toUserId }

Invites
  POST   /groups/:id/invites
  GET    /invites/:token
  POST   /invites/:token/accept

Activity
  GET    /groups/:id/activity

Notifications
  GET    /notifications
  GET    /notifications/unread-count
  POST   /notifications/:id/read
  POST   /notifications/read-all

Admin (requires isSuperAdmin on /me)
  GET    /admin/stats/overview
  GET    /admin/stats/growth
  GET    /admin/stats/financial
  GET    /admin/stats/engagement
  GET    /admin/users?search=&page=&pageSize=
  GET    /admin/users/:id
  GET    /admin/groups?search=&page=&pageSize=
  GET    /admin/groups/:id
```

---

## 14. Authorization rules (must enforce server-side)

| Action | Allowed |
| --- | --- |
| View group / activity / cycles | Group member |
| Update/delete group, invite, reorder, remove, make admin | `admin` |
| Upload receipt | Member of group, **not** current collector (or allow but UI hides) |
| Confirm / dispute / nudge | Current cycle **collector** |
| Close cycle | Collector **or** admin |
| Accept invite | Authenticated user; invite `active` and not expired |
| Notifications | Owner only |

---

## 15. Explicitly out of scope

- Payment rails, wallets, escrow, USSD initiation
- Moving or custody of funds
- Credit scoring / loans
- Legal enforcement between members
- Non-monthly frequencies (schema allows only `monthly` for now)

---

## 16. App routes (frontend)

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
| `/admin/users`, `/admin/users/[id]` | Platform users |
| `/admin/groups`, `/admin/groups/[id]` | All groups (admin view) |
| `/admin/insights` | Financial & engagement |

---

*Generated from the Pocket Circle frontend MVP. Update this file when product behavior changes.*
