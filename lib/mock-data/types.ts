export interface User {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  /** Legacy computed full name — prefer getFullName(). */
  name?: string;
  email: string;
  bankName: string;
  bankCode?: string | null;
  accountNumber: string;
  bankVerified?: boolean;
  password?: string;
  notifyEmail?: boolean;
  notifyWhatsApp?: boolean;
  /** Platform super admin — gates /admin UI (server still enforces). */
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

export interface Group {
  id: string;
  name: string;
  contributionAmount: number;
  frequency: GroupFrequency;
  members: GroupMember[];
  createdAt: string;
}

/** GET /admin/stats/overview */
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

/** GET /admin/stats/growth */
export interface AdminGrowthDayPoint {
  date: string;
  count: number;
}

export interface AdminGrowthMonthPoint {
  month: string;
  count: number;
}

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

/** GET /admin/users row */
export interface AdminUserRow {
  id: string;
  firstName?: string;
  lastName?: string;
  middleName?: string | null;
  name?: string;
  email: string;
  createdAt: string;
  lastLoginAt: string | null;
  groupsCount: number;
  totalContributed: number;
  totalCollected: number;
}

export interface AdminPaginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** GET /admin/users/:id */
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
    status: Contribution["status"];
    date: string;
  }[];
}

/** GET /admin/groups row */
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

/** GET /admin/stats/financial */
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

/** GET /admin/stats/engagement */
export interface AdminEngagementStats {
  inviteAcceptanceRate: number;
  averageGroupSize: number;
  averageCompletedCyclesPerGroup: number;
  disputeRate: number;
  averageTimeToPaymentMs: number | null;
  averageTimeToPaymentHours: number | null;
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

export interface Contribution {
  id: string;
  cycleId: string;
  payerUserId: string;
  amount: number;
  receiptUrl?: string;
  note?: string;
  status: "pending" | "confirmed" | "disputed";
  disputeReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedByUserId?: string;
}

export interface Invite {
  token: string;
  groupId: string;
  invitedByUserId: string;
  expiresAt: string;
  status: "active" | "expired" | "accepted" | "revoked";
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

export type ContributionDisplayStatus =
  | "paid"
  | "pending"
  | "overdue"
  | "disputed";
