/** Shared domain + API response types for the real backend. */

export interface User {
  id: string;
  name: string;
  email: string;
  bankName: string;
  accountNumber: string;
  notifyEmail?: boolean;
  notifyWhatsApp?: boolean;
  isSuperAdmin?: boolean;
  createdAt?: string;
  lastLoginAt?: string | null;
}

export type GroupFrequency = "weekly" | "biweekly" | "monthly";

export interface GroupMember {
  userId: string;
  role: "admin" | "member";
  payoutOrder: number;
}

/** Member row as returned on group detail / list (user nested). */
export interface GroupMemberWithUser extends GroupMember {
  user?: Pick<
    User,
    "id" | "name" | "email" | "bankName" | "accountNumber"
  >;
  name?: string;
  displayStatus?: ContributionDisplayStatus;
  contributionStatus?: ContributionDisplayStatus;
}

export interface Group {
  id: string;
  name: string;
  contributionAmount: number;
  frequency: GroupFrequency;
  members: GroupMember[] | GroupMemberWithUser[];
  createdAt: string;
}

/**
 * Enriched group list item for the dashboard.
 * Backend may nest fields slightly differently — UI reads defensively.
 */
export interface GroupListItem extends Group {
  memberCount?: number;
  whoseTurn?: WhoseTurn | null;
  activeCycle?: Cycle | null;
  nextPayoutDate?: string | null;
  myContributionStatus?: ContributionDisplayStatus;
}

export interface WhoseTurn {
  id: string;
  name: string;
  bankName?: string;
  accountNumber?: string;
}

/** GET /groups/:id — enriched detail payload. */
export interface GroupDetail extends Group {
  members: GroupMemberWithUser[];
  activeCycle: Cycle | null;
  whoseTurn: WhoseTurn | null;
  myContributionStatus: ContributionDisplayStatus;
}

export interface Cycle {
  id: string;
  groupId: string;
  cycleNumber: number;
  collectorUserId: string;
  periodStart: string;
  periodEnd: string;
  status: "active" | "completed";
}

/** Stored contribution status from the backend. */
export type ContributionStatus = "pending" | "confirmed" | "disputed";

/** Derived display status — prefer this in UI badges. */
export type ContributionDisplayStatus =
  | "paid"
  | "pending"
  | "overdue"
  | "disputed";

export interface Contribution {
  id: string;
  cycleId: string;
  payerUserId: string;
  amount: number;
  receiptUrl?: string;
  note?: string;
  status: ContributionStatus;
  disputeReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedByUserId?: string;
  /** Present on cycle summary / enriched payloads. */
  displayStatus?: ContributionDisplayStatus;
}

export interface Invite {
  token: string;
  groupId: string;
  invitedByUserId: string;
  expiresAt: string;
  status: "active" | "expired" | "accepted";
}

/** Public invite view (may nest group + inviter). */
export interface InvitePublic {
  token: string;
  groupId?: string;
  invitedByUserId?: string;
  expiresAt: string;
  status: Invite["status"];
  group?: Pick<Group, "id" | "name" | "contributionAmount" | "frequency">;
  invitedBy?: Pick<User, "id" | "name">;
  groupName?: string;
  contributionAmount?: number;
  inviterName?: string;
}

export type ActivityType =
  | "member_joined"
  | "receipt_uploaded"
  | "payment_confirmed"
  | "payment_disputed"
  | "reminder_sent"
  | "cycle_started"
  | "cycle_completed"
  | "turn_changed";

export interface ActivityEvent {
  id: string;
  groupId: string;
  type: ActivityType;
  actorUserId: string;
  targetUserId?: string;
  cycleId?: string;
  message: string;
  createdAt: string;
}

export type NotificationType =
  | "your_turn"
  | "receipt_uploaded"
  | "payment_confirmed"
  | "payment_disputed"
  | "reminder"
  | "invite_accepted"
  | "cycle_started";

export interface Notification {
  id: string;
  userId: string;
  groupId?: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string;
  read: boolean;
  createdAt: string;
}

export interface CycleSummaryRow {
  userId: string;
  name: string;
  displayStatus: ContributionDisplayStatus;
  amount?: number;
  contribution?: Contribution;
}

export interface CycleSummary {
  cycle?: Cycle;
  cycleNumber?: number;
  periodStart?: string;
  periodEnd?: string;
  collectorUserId?: string;
  collectorName?: string;
  contributionAmount?: number;
  rows?: CycleSummaryRow[];
  members?: CycleSummaryRow[];
}

export interface CreateInviteResponse {
  token: string;
  expiresAt?: string;
  url?: string;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface AdminStatsOverview {
  totalUsers: number;
  totalGroups: number;
  totalActiveCycles: number;
  totalCompletedCycles: number;
  totalConfirmedVolume: number;
  totalPendingAmount: number;
  totalDisputedAmount: number;
  totalOverdueCount: number;
}

export interface AdminGrowthDayPoint {
  date: string;
  count: number;
}

export interface AdminGrowthMonthPoint {
  month: string;
  count: number;
}

/** Nest `GET /admin/stats/growth` */
export interface AdminGrowthStats {
  byDay: {
    users: AdminGrowthDayPoint[];
    groups: AdminGrowthDayPoint[];
  };
  byMonth: {
    users: AdminGrowthMonthPoint[];
    groups: AdminGrowthMonthPoint[];
  };
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLoginAt: string | null;
  groupsCount: number;
  totalContributed: number;
  totalCollected: number;
}

export interface AdminUserDetail {
  user: User;
  groups: {
    id: string;
    name: string;
    role: "admin" | "member";
    payoutOrder: number;
  }[];
  contributions: {
    id: string;
    groupId: string;
    groupName: string;
    cycleNumber: number;
    amount: number;
    status: ContributionStatus;
    date: string;
  }[];
}

export interface AdminGroupRow {
  id: string;
  name: string;
  memberCount: number;
  contributionAmount: number;
  frequency: GroupFrequency;
  currentCycleNumber: number | null;
  currentCollectorName: string | null;
  totalConfirmedVolume: number;
  createdAt: string;
}

/** Raw Prisma-shaped group for admin detail (nested relations). */
export interface AdminGroupDetail {
  id: string;
  name: string;
  contributionAmount: number;
  frequency: GroupFrequency;
  createdAt: string;
  members?: Array<{
    userId: string;
    role: "admin" | "member";
    payoutOrder: number;
    user?: User;
  }>;
  cycles?: Cycle[];
  invites?: Invite[];
  [key: string]: unknown;
}

export interface AdminFinancialStats {
  byGroup: {
    groupId: string;
    groupName: string;
    totalConfirmedVolume: number;
  }[];
  byFrequency: {
    frequency: GroupFrequency;
    totalConfirmedVolume: number;
  }[];
}

export interface AdminEngagementStats {
  inviteAcceptanceRate: number;
  averageGroupSize: number;
  averageCompletedCyclesPerGroup: number;
  disputeRate: number;
  averageTimeToPaymentMs: number | null;
  averageTimeToPaymentHours: number | null;
}
