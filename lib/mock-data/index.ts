import { delay } from "@/lib/utils";
import { store } from "./seed";
import type {
  ActivityEvent,
  Contribution,
  ContributionDisplayStatus,
  Cycle,
  Group,
  Invite,
  Notification,
  User,
} from "./types";

function clone<T>(value: T): T {
  return structuredClone(value);
}

function pushActivity(
  event: Omit<ActivityEvent, "id" | "createdAt"> & { createdAt?: string },
) {
  store.activityEvents.unshift({
    id: `a${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    createdAt: event.createdAt ?? new Date().toISOString(),
    ...event,
  });
}

function pushNotification(
  note: Omit<Notification, "id" | "createdAt" | "read"> & {
    createdAt?: string;
    read?: boolean;
  },
) {
  store.notifications.unshift({
    id: `n${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    createdAt: note.createdAt ?? new Date().toISOString(),
    read: note.read ?? false,
    ...note,
  });
}

function userName(id: string) {
  const u = store.users.find((user) => user.id === id);
  if (!u) return "Someone";
  const parts = [u.firstName, u.middleName, u.lastName]
    .map((p) => p?.trim())
    .filter(Boolean);
  return parts.length ? parts.join(" ") : (u.name ?? "Someone");
}

function groupName(id: string) {
  return store.groups.find((g) => g.id === id)?.name ?? "a group";
}

export async function getUser(id: string): Promise<User | null> {
  await delay();
  const user = store.users.find((u) => u.id === id);
  return user ? clone(user) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await delay();
  const user = store.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  return user ? clone(user) : null;
}

export async function createUser(
  data: Omit<User, "id"> & { password: string },
): Promise<User> {
  await delay();
  const user: User = {
    id: `u${Date.now()}`,
    firstName: data.firstName,
    lastName: data.lastName,
    middleName: data.middleName ?? null,
    email: data.email,
    bankName: data.bankName,
    bankCode: data.bankCode,
    accountNumber: data.accountNumber,
    bankVerified: data.bankVerified ?? false,
    password: data.password,
    notifyEmail: true,
    notifyWhatsApp: true,
    isSuperAdmin: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  store.users.push(user);
  return clone(user);
}

export async function updateUser(
  id: string,
  data: Partial<User>,
): Promise<User | null> {
  await delay();
  const index = store.users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  store.users[index] = { ...store.users[index], ...data, id };
  return clone(store.users[index]);
}

export async function getGroupsForUser(userId: string): Promise<Group[]> {
  await delay();
  return clone(
    store.groups.filter((g) => g.members.some((m) => m.userId === userId)),
  );
}

export async function getGroup(id: string): Promise<Group | null> {
  await delay();
  const group = store.groups.find((g) => g.id === id);
  return group ? clone(group) : null;
}

export async function createGroup(data: {
  name: string;
  contributionAmount: number;
  frequency: Group["frequency"];
  adminUserId: string;
  memberEmails?: string[];
}): Promise<Group> {
  await delay();
  const members: Group["members"] = [
    { userId: data.adminUserId, role: "admin", payoutOrder: 1 },
  ];

  let order = 2;
  for (const email of data.memberEmails ?? []) {
    const existing = store.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (existing && existing.id !== data.adminUserId) {
      members.push({
        userId: existing.id,
        role: "member",
        payoutOrder: order++,
      });
    }
  }

  const group: Group = {
    id: `g${Date.now()}`,
    name: data.name,
    contributionAmount: data.contributionAmount,
    frequency: data.frequency,
    members,
    createdAt: new Date().toISOString(),
  };
  store.groups.push(group);

  const now = new Date();
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const cycle: Cycle = {
    id: `c${Date.now()}`,
    groupId: group.id,
    cycleNumber: 1,
    collectorUserId: data.adminUserId,
    periodStart: now.toISOString().slice(0, 10),
    periodEnd: periodEnd.toISOString().slice(0, 10),
    status: "active",
  };
  store.cycles.push(cycle);

  return clone(group);
}

export async function updateGroup(
  id: string,
  data: Partial<Pick<Group, "name" | "contributionAmount" | "frequency">>,
): Promise<Group | null> {
  await delay();
  const index = store.groups.findIndex((g) => g.id === id);
  if (index === -1) return null;
  store.groups[index] = { ...store.groups[index], ...data };
  return clone(store.groups[index]);
}

export async function deleteGroup(id: string): Promise<boolean> {
  await delay();
  const index = store.groups.findIndex((g) => g.id === id);
  if (index === -1) return false;
  store.groups.splice(index, 1);
  return true;
}

export async function getCycleForGroup(
  groupId: string,
): Promise<Cycle | null> {
  await delay();
  const active = store.cycles.find(
    (c) => c.groupId === groupId && c.status === "active",
  );
  return active ? clone(active) : null;
}

export async function getCyclesForGroup(groupId: string): Promise<Cycle[]> {
  await delay();
  return clone(
    store.cycles
      .filter((c) => c.groupId === groupId)
      .sort((a, b) => b.cycleNumber - a.cycleNumber),
  );
}

export async function getContributionsForCycle(
  cycleId: string,
): Promise<Contribution[]> {
  await delay();
  return clone(store.contributions.filter((c) => c.cycleId === cycleId));
}

export async function getUserContributionStatus(
  cycleId: string,
  userId: string,
  periodEnd: string,
): Promise<ContributionDisplayStatus> {
  await delay(100);
  const contribution = store.contributions.find(
    (c) => c.cycleId === cycleId && c.payerUserId === userId,
  );
  if (contribution?.status === "confirmed") return "paid";
  if (contribution?.status === "disputed") return "disputed";
  if (contribution?.status === "pending") return "pending";
  const end = new Date(periodEnd);
  const today = new Date();
  if (today > end) return "overdue";
  return "pending";
}

export async function submitReceipt(data: {
  cycleId: string;
  payerUserId: string;
  amount: number;
  note?: string;
  receiptUrl: string;
}): Promise<Contribution> {
  await delay();
  const cycle = store.cycles.find((c) => c.id === data.cycleId);
  const existingIndex = store.contributions.findIndex(
    (c) => c.cycleId === data.cycleId && c.payerUserId === data.payerUserId,
  );
  const contribution: Contribution = {
    id:
      existingIndex >= 0
        ? store.contributions[existingIndex].id
        : `contrib${Date.now()}`,
    cycleId: data.cycleId,
    payerUserId: data.payerUserId,
    amount: data.amount,
    note: data.note,
    receiptUrl: data.receiptUrl,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  if (existingIndex >= 0) {
    store.contributions[existingIndex] = contribution;
  } else {
    store.contributions.push(contribution);
  }

  if (cycle) {
    pushActivity({
      groupId: cycle.groupId,
      type: "receipt_uploaded",
      actorUserId: data.payerUserId,
      cycleId: cycle.id,
      message: `${userName(data.payerUserId)} uploaded a receipt`,
    });
    pushNotification({
      userId: cycle.collectorUserId,
      groupId: cycle.groupId,
      type: "receipt_uploaded",
      title: "Receipt uploaded",
      body: `${userName(data.payerUserId)} uploaded a receipt for ${groupName(cycle.groupId)}.`,
      href: `/groups/${cycle.groupId}`,
    });
  }

  return clone(contribution);
}

export async function confirmContribution(
  contributionId: string,
  reviewerUserId: string,
): Promise<Contribution | null> {
  await delay();
  const contribution = store.contributions.find((c) => c.id === contributionId);
  if (!contribution) return null;
  const cycle = store.cycles.find((c) => c.id === contribution.cycleId);
  contribution.status = "confirmed";
  contribution.reviewedAt = new Date().toISOString();
  contribution.reviewedByUserId = reviewerUserId;
  delete contribution.disputeReason;

  if (cycle) {
    pushActivity({
      groupId: cycle.groupId,
      type: "payment_confirmed",
      actorUserId: reviewerUserId,
      targetUserId: contribution.payerUserId,
      cycleId: cycle.id,
      message: `${userName(reviewerUserId)} confirmed ${userName(contribution.payerUserId)}'s payment`,
    });
    pushNotification({
      userId: contribution.payerUserId,
      groupId: cycle.groupId,
      type: "payment_confirmed",
      title: "Payment confirmed",
      body: `${userName(reviewerUserId)} confirmed your payment in ${groupName(cycle.groupId)}.`,
      href: `/groups/${cycle.groupId}`,
    });
  }

  return clone(contribution);
}

export async function disputeContribution(
  contributionId: string,
  reviewerUserId: string,
  reason: string,
): Promise<Contribution | null> {
  await delay();
  const contribution = store.contributions.find((c) => c.id === contributionId);
  if (!contribution) return null;
  const cycle = store.cycles.find((c) => c.id === contribution.cycleId);
  contribution.status = "disputed";
  contribution.disputeReason = reason;
  contribution.reviewedAt = new Date().toISOString();
  contribution.reviewedByUserId = reviewerUserId;

  if (cycle) {
    pushActivity({
      groupId: cycle.groupId,
      type: "payment_disputed",
      actorUserId: reviewerUserId,
      targetUserId: contribution.payerUserId,
      cycleId: cycle.id,
      message: `${userName(reviewerUserId)} flagged ${userName(contribution.payerUserId)}'s receipt`,
    });
    pushNotification({
      userId: contribution.payerUserId,
      groupId: cycle.groupId,
      type: "payment_disputed",
      title: "Receipt flagged",
      body: `${userName(reviewerUserId)} flagged your receipt in ${groupName(cycle.groupId)}. ${reason}`,
      href: `/groups/${cycle.groupId}`,
    });
  }

  return clone(contribution);
}

export async function sendReminder(data: {
  groupId: string;
  cycleId: string;
  fromUserId: string;
  toUserId: string;
}): Promise<{ whatsappUrl: string }> {
  await delay();
  const group = store.groups.find((g) => g.id === data.groupId);
  const toUser = store.users.find((u) => u.id === data.toUserId);
  const amount = group?.contributionAmount ?? 0;

  pushActivity({
    groupId: data.groupId,
    type: "reminder_sent",
    actorUserId: data.fromUserId,
    targetUserId: data.toUserId,
    cycleId: data.cycleId,
    message: `${userName(data.fromUserId)} nudged ${userName(data.toUserId)} to pay`,
  });
  pushNotification({
    userId: data.toUserId,
    groupId: data.groupId,
    type: "reminder",
    title: "Friendly nudge",
    body: `${userName(data.fromUserId)} is waiting for your ${groupName(data.groupId)} contribution.`,
    href: `/groups/${data.groupId}`,
  });

  const text = encodeURIComponent(
    `Hi ${toUser ? userName(toUser.id) : "there"}, friendly reminder to send your ₦${amount.toLocaleString()} contribution for ${group?.name ?? "our circle"} this month. Thanks! — via Pocket Circle`,
  );
  return { whatsappUrl: `https://wa.me/?text=${text}` };
}

export async function closeCycleAndStartNext(
  groupId: string,
  actorUserId: string,
): Promise<{ completed: Cycle; next: Cycle } | null> {
  await delay();
  const group = store.groups.find((g) => g.id === groupId);
  const active = store.cycles.find(
    (c) => c.groupId === groupId && c.status === "active",
  );
  if (!group || !active) return null;

  active.status = "completed";
  pushActivity({
    groupId,
    type: "cycle_completed",
    actorUserId,
    cycleId: active.id,
    message: `Cycle ${active.cycleNumber} closed`,
  });

  const ordered = [...group.members].sort(
    (a, b) => a.payoutOrder - b.payoutOrder,
  );
  const currentIndex = ordered.findIndex(
    (m) => m.userId === active.collectorUserId,
  );
  const nextMember = ordered[(currentIndex + 1) % ordered.length];
  const now = new Date();
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const next: Cycle = {
    id: `c${Date.now()}`,
    groupId,
    cycleNumber: active.cycleNumber + 1,
    collectorUserId: nextMember.userId,
    periodStart: now.toISOString().slice(0, 10),
    periodEnd: periodEnd.toISOString().slice(0, 10),
    status: "active",
  };
  store.cycles.push(next);

  pushActivity({
    groupId,
    type: "cycle_started",
    actorUserId,
    cycleId: next.id,
    message: `Cycle ${next.cycleNumber} started — ${userName(nextMember.userId)} is collecting`,
  });
  pushActivity({
    groupId,
    type: "turn_changed",
    actorUserId,
    targetUserId: nextMember.userId,
    cycleId: next.id,
    message: `It's ${userName(nextMember.userId)}'s turn to collect`,
  });

  for (const member of group.members) {
    if (member.userId === nextMember.userId) {
      pushNotification({
        userId: member.userId,
        groupId,
        type: "your_turn",
        title: "It's your turn",
        body: `You're collecting for ${group.name} this month.`,
        href: `/groups/${groupId}`,
      });
    } else {
      pushNotification({
        userId: member.userId,
        groupId,
        type: "cycle_started",
        title: "New cycle started",
        body: `Cycle ${next.cycleNumber} started in ${group.name}. ${userName(nextMember.userId)} is collecting.`,
        href: `/groups/${groupId}`,
      });
    }
  }

  return { completed: clone(active), next: clone(next) };
}

export async function getActivityForGroup(
  groupId: string,
): Promise<ActivityEvent[]> {
  await delay();
  return clone(
    store.activityEvents
      .filter((e) => e.groupId === groupId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
  );
}

export async function getNotificationsForUser(
  userId: string,
): Promise<Notification[]> {
  await delay();
  return clone(
    store.notifications
      .filter((n) => n.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
  );
}

export async function getUnreadNotificationCount(
  userId: string,
): Promise<number> {
  await delay(50);
  return store.notifications.filter((n) => n.userId === userId && !n.read)
    .length;
}

export async function markNotificationRead(
  id: string,
): Promise<Notification | null> {
  await delay(100);
  const note = store.notifications.find((n) => n.id === id);
  if (!note) return null;
  note.read = true;
  return clone(note);
}

export async function markAllNotificationsRead(
  userId: string,
): Promise<number> {
  await delay();
  let count = 0;
  for (const note of store.notifications) {
    if (note.userId === userId && !note.read) {
      note.read = true;
      count += 1;
    }
  }
  return count;
}

export async function getCycleSummary(cycleId: string): Promise<{
  cycle: Cycle;
  group: Group;
  collector: User;
  rows: {
    userId: string;
    name: string;
    status: ContributionDisplayStatus;
    amount?: number;
    submittedAt?: string;
  }[];
} | null> {
  await delay();
  const cycle = store.cycles.find((c) => c.id === cycleId);
  if (!cycle) return null;
  const group = store.groups.find((g) => g.id === cycle.groupId);
  if (!group) return null;
  const collector = store.users.find((u) => u.id === cycle.collectorUserId);
  if (!collector) return null;

  const rows = group.members
    .filter((m) => m.userId !== cycle.collectorUserId)
    .map((m) => {
      const user = store.users.find((u) => u.id === m.userId);
      const contrib = store.contributions.find(
        (c) => c.cycleId === cycleId && c.payerUserId === m.userId,
      );
      let status: ContributionDisplayStatus = "pending";
      if (contrib?.status === "confirmed") status = "paid";
      else if (contrib?.status === "disputed") status = "disputed";
      else if (contrib?.status === "pending") status = "pending";
      else if (new Date() > new Date(cycle.periodEnd)) status = "overdue";
      return {
        userId: m.userId,
        name: user ? userName(user.id) : "Unknown",
        status,
        amount: contrib?.amount,
        submittedAt: contrib?.submittedAt,
      };
    });

  return {
    cycle: clone(cycle),
    group: clone(group),
    collector: clone(collector),
    rows,
  };
}

export async function reorderMembers(
  groupId: string,
  orderedUserIds: string[],
): Promise<Group | null> {
  await delay();
  const group = store.groups.find((g) => g.id === groupId);
  if (!group) return null;
  group.members = orderedUserIds.map((userId, index) => {
    const existing = group.members.find((m) => m.userId === userId)!;
    return { ...existing, payoutOrder: index + 1 };
  });
  return clone(group);
}

export async function removeMember(
  groupId: string,
  userId: string,
): Promise<Group | null> {
  await delay();
  const group = store.groups.find((g) => g.id === groupId);
  if (!group) return null;
  group.members = group.members
    .filter((m) => m.userId !== userId)
    .map((m, index) => ({ ...m, payoutOrder: index + 1 }));
  return clone(group);
}

export async function makeAdmin(
  groupId: string,
  userId: string,
): Promise<Group | null> {
  await delay();
  const group = store.groups.find((g) => g.id === groupId);
  if (!group) return null;
  const member = group.members.find((m) => m.userId === userId);
  if (!member) return null;
  member.role = "admin";
  return clone(group);
}

export async function createInvite(
  groupId: string,
  invitedByUserId: string,
): Promise<Invite> {
  await delay();
  const invite: Invite = {
    token: `invite-${groupId}-${Date.now()}`,
    groupId,
    invitedByUserId,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  };
  store.invites.push(invite);
  return clone(invite);
}

export async function getInvite(token: string): Promise<Invite | null> {
  await delay();
  const invite = store.invites.find((i) => i.token === token);
  if (!invite) return null;
  if (invite.status === "revoked") {
    return clone({ ...invite, status: "revoked" });
  }
  if (
    invite.status === "expired" ||
    new Date(invite.expiresAt) < new Date()
  ) {
    return clone({ ...invite, status: "expired" });
  }
  return clone(invite);
}

export async function acceptInvite(
  token: string,
  userId: string,
): Promise<Group | null> {
  await delay();
  const invite = store.invites.find((i) => i.token === token);
  if (!invite || invite.status !== "active") return null;
  if (new Date(invite.expiresAt) < new Date()) {
    invite.status = "expired";
    return null;
  }
  const group = store.groups.find((g) => g.id === invite.groupId);
  if (!group) return null;
  if (!group.members.some((m) => m.userId === userId)) {
    const maxOrder = Math.max(...group.members.map((m) => m.payoutOrder), 0);
    group.members.push({
      userId,
      role: "member",
      payoutOrder: maxOrder + 1,
    });
  }
  invite.status = "accepted";
  const inviter = invite.invitedByUserId;
  pushActivity({
    groupId: group.id,
    type: "member_joined",
    actorUserId: userId,
    message: `${userName(userId)} joined the group`,
  });
  pushNotification({
    userId: inviter,
    groupId: group.id,
    type: "invite_accepted",
    title: "Invite accepted",
    body: `${userName(userId)} joined ${group.name}.`,
    href: `/groups/${group.id}`,
  });
  return clone(group);
}

export async function getUsersByIds(ids: string[]): Promise<User[]> {
  await delay(100);
  return clone(store.users.filter((u) => ids.includes(u.id)));
}

export type {
  ActivityEvent,
  Contribution,
  Cycle,
  Group,
  GroupFrequency,
  Invite,
  Notification,
  User,
  AdminStatsOverview,
  AdminGrowthStats,
  AdminGrowthDayPoint,
  AdminGrowthMonthPoint,
  AdminUserRow,
  AdminUserDetail,
  AdminGroupRow,
  AdminPaginated,
  AdminFinancialStats,
  AdminEngagementStats,
} from "./types";
export type { ContributionDisplayStatus } from "./types";

export {
  getAdminStatsOverview,
  getAdminStatsGrowth,
  getAdminUsers,
  getAdminUser,
  getAdminGroups,
  getAdminGroup,
  getAdminStatsFinancial,
  getAdminStatsEngagement,
} from "./admin";
