import { delay } from "@/lib/utils";
import { store } from "./seed";
import type {
  AdminEngagementStats,
  AdminFinancialStats,
  AdminGroupRow,
  AdminGrowthDayPoint,
  AdminGrowthMonthPoint,
  AdminGrowthStats,
  AdminPaginated,
  AdminStatsOverview,
  AdminUserDetail,
  AdminUserRow,
  Group,
  GroupFrequency,
  User,
} from "./types";

function clone<T>(value: T): T {
  return structuredClone(value);
}

function confirmedVolume(): number {
  return store.contributions
    .filter((c) => c.status === "confirmed")
    .reduce((sum, c) => sum + c.amount, 0);
}

function userContributed(userId: string): number {
  return store.contributions
    .filter((c) => c.payerUserId === userId && c.status === "confirmed")
    .reduce((sum, c) => sum + c.amount, 0);
}

function userCollected(userId: string): number {
  const cycleIds = new Set(
    store.cycles.filter((c) => c.collectorUserId === userId).map((c) => c.id),
  );
  return store.contributions
    .filter((c) => cycleIds.has(c.cycleId) && c.status === "confirmed")
    .reduce((sum, c) => sum + c.amount, 0);
}

function groupConfirmedVolume(groupId: string): number {
  const cycleIds = new Set(
    store.cycles.filter((c) => c.groupId === groupId).map((c) => c.id),
  );
  return store.contributions
    .filter((c) => cycleIds.has(c.cycleId) && c.status === "confirmed")
    .reduce((sum, c) => sum + c.amount, 0);
}

function toUserRow(user: User): AdminUserRow {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt ?? "2025-01-01T00:00:00.000Z",
    lastLoginAt: user.lastLoginAt ?? null,
    groupsCount: store.groups.filter((g) =>
      g.members.some((m) => m.userId === user.id),
    ).length,
    totalContributed: userContributed(user.id),
    totalCollected: userCollected(user.id),
  };
}

function toGroupRow(group: Group): AdminGroupRow {
  const active = store.cycles.find(
    (c) => c.groupId === group.id && c.status === "active",
  );
  const collector = active
    ? store.users.find((u) => u.id === active.collectorUserId)
    : null;
  return {
    id: group.id,
    name: group.name,
    memberCount: group.members.length,
    contributionAmount: group.contributionAmount,
    frequency: group.frequency,
    currentCycleNumber: active?.cycleNumber ?? null,
    currentCollectorName: collector?.name ?? null,
    totalConfirmedVolume: groupConfirmedVolume(group.id),
    createdAt: group.createdAt,
  };
}

function padDailyCounts(
  dates: string[],
  days: number,
): AdminGrowthDayPoint[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const byDay = new Map<string, number>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }

  for (const date of dates) {
    const key = date.slice(0, 10);
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }

  return [...byDay.entries()].map(([date, count]) => ({ date, count }));
}

function monthlyCounts(dates: string[]): AdminGrowthMonthPoint[] {
  const byMonth = new Map<string, number>();
  for (const date of dates) {
    const key = date.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));
}

/** GET /admin/stats/overview */
export async function getAdminStatsOverview(): Promise<AdminStatsOverview> {
  await delay();
  const pending = store.contributions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.amount, 0);
  const disputed = store.contributions
    .filter((c) => c.status === "disputed")
    .reduce((sum, c) => sum + c.amount, 0);
  return {
    totalUsers: store.users.length,
    totalGroups: store.groups.length,
    totalActiveCycles: store.cycles.filter((c) => c.status === "active").length,
    totalCompletedCycles: store.cycles.filter((c) => c.status === "completed")
      .length,
    totalConfirmedVolume: confirmedVolume(),
    totalPendingAmount: pending,
    totalDisputedAmount: disputed,
    totalOverdueCount: 0,
  };
}

/** GET /admin/stats/growth */
export async function getAdminStatsGrowth(): Promise<AdminGrowthStats> {
  await delay();
  const userDates = store.users.map(
    (u) => u.createdAt ?? "2025-01-01T00:00:00.000Z",
  );
  const groupDates = store.groups.map((g) => g.createdAt);
  return {
    byDay: {
      users: padDailyCounts(userDates, 30),
      groups: padDailyCounts(groupDates, 30),
    },
    byMonth: {
      users: monthlyCounts(userDates),
      groups: monthlyCounts(groupDates),
    },
  };
}

/** GET /admin/users?search=&page=&pageSize= */
export async function getAdminUsers(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminPaginated<AdminUserRow>> {
  await delay();
  const page = Math.max(1, params?.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params?.pageSize ?? 20));
  const q = (params?.search ?? "").trim().toLowerCase();

  let rows = store.users.map(toUserRow);
  if (q) {
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q),
    );
  }
  rows.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const total = rows.length;
  const start = (page - 1) * pageSize;
  return {
    items: clone(rows.slice(start, start + pageSize)),
    total,
    page,
    pageSize,
  };
}

/** GET /admin/users/:id */
export async function getAdminUser(id: string): Promise<AdminUserDetail | null> {
  await delay();
  const user = store.users.find((u) => u.id === id);
  if (!user) return null;

  const groups = store.groups
    .filter((g) => g.members.some((m) => m.userId === id))
    .map((g) => {
      const member = g.members.find((m) => m.userId === id)!;
      return {
        id: g.id,
        name: g.name,
        role: member.role,
        payoutOrder: member.payoutOrder,
      };
    });

  const contributions = store.contributions
    .filter((c) => c.payerUserId === id)
    .map((c) => {
      const cycle = store.cycles.find((cy) => cy.id === c.cycleId);
      const group = cycle
        ? store.groups.find((g) => g.id === cycle.groupId)
        : null;
      return {
        id: c.id,
        groupId: group?.id ?? "",
        groupName: group?.name ?? "Unknown group",
        cycleNumber: cycle?.cycleNumber ?? 0,
        amount: c.amount,
        status: c.status,
        date: c.submittedAt ?? c.reviewedAt ?? "",
      };
    })
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

  return {
    user: clone({ ...user, password: undefined }),
    groups: clone(groups),
    contributions: clone(contributions),
  };
}

/** GET /admin/groups?search=&page=&pageSize= */
export async function getAdminGroups(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminPaginated<AdminGroupRow>> {
  await delay();
  const page = Math.max(1, params?.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params?.pageSize ?? 20));
  const q = (params?.search ?? "").trim().toLowerCase();

  let rows = store.groups.map(toGroupRow);
  if (q) {
    rows = rows.filter((r) => r.name.toLowerCase().includes(q));
  }
  rows.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const total = rows.length;
  const start = (page - 1) * pageSize;
  return {
    items: clone(rows.slice(start, start + pageSize)),
    total,
    page,
    pageSize,
  };
}

/**
 * GET /admin/groups/:id
 * Same shape as member getGroup — no membership gate.
 */
export async function getAdminGroup(id: string): Promise<Group | null> {
  await delay();
  const group = store.groups.find((g) => g.id === id);
  return group ? clone(group) : null;
}

/** GET /admin/stats/financial */
export async function getAdminStatsFinancial(): Promise<AdminFinancialStats> {
  await delay();
  const byGroup = store.groups
    .map((g) => ({
      groupId: g.id,
      groupName: g.name,
      totalConfirmedVolume: groupConfirmedVolume(g.id),
    }))
    .sort((a, b) => b.totalConfirmedVolume - a.totalConfirmedVolume);

  const freqTotals: Record<GroupFrequency, number> = {
    weekly: 0,
    biweekly: 0,
    monthly: 0,
  };
  for (const g of store.groups) {
    freqTotals[g.frequency] += groupConfirmedVolume(g.id);
  }

  return {
    byGroup: clone(byGroup),
    byFrequency: (["weekly", "biweekly", "monthly"] as GroupFrequency[]).map(
      (frequency) => ({
        frequency,
        totalConfirmedVolume: freqTotals[frequency],
      }),
    ),
  };
}

/** GET /admin/stats/engagement */
export async function getAdminStatsEngagement(): Promise<AdminEngagementStats> {
  await delay();
  const invites = store.invites;
  const decided = invites.filter(
    (i) => i.status === "accepted" || i.status === "expired",
  );
  const accepted = invites.filter((i) => i.status === "accepted").length;
  const inviteAcceptanceRate =
    decided.length > 0
      ? accepted / decided.length
      : invites.length > 0
        ? accepted / invites.length
        : 0;

  const averageGroupSize =
    store.groups.length === 0
      ? 0
      : store.groups.reduce((s, g) => s + g.members.length, 0) /
        store.groups.length;

  const completedByGroup = store.groups.map(
    (g) =>
      store.cycles.filter((c) => c.groupId === g.id && c.status === "completed")
        .length,
  );
  const averageCompletedCyclesPerGroup =
    completedByGroup.length === 0
      ? 0
      : completedByGroup.reduce((a, b) => a + b, 0) / completedByGroup.length;

  const totalContribs = store.contributions.length;
  const disputed = store.contributions.filter(
    (c) => c.status === "disputed",
  ).length;
  const disputeRate = totalContribs === 0 ? 0 : disputed / totalContribs;

  const withTiming = store.contributions.filter(
    (c) => c.submittedAt && c.reviewedAt && c.status === "confirmed",
  );
  const averageTimeToPaymentHours =
    withTiming.length === 0
      ? null
      : withTiming.reduce((sum, c) => {
          const hours =
            (new Date(c.reviewedAt!).getTime() -
              new Date(c.submittedAt!).getTime()) /
            (1000 * 60 * 60);
          return sum + hours;
        }, 0) / withTiming.length;

  return {
    inviteAcceptanceRate,
    averageGroupSize,
    averageCompletedCyclesPerGroup,
    disputeRate,
    averageTimeToPaymentMs:
      averageTimeToPaymentHours == null
        ? null
        : averageTimeToPaymentHours * 1000 * 60 * 60,
    averageTimeToPaymentHours,
  };
}
