import type {
  Contribution,
  ContributionDisplayStatus,
  Cycle,
  GroupFrequency,
  GroupListItem,
  GroupMemberWithUser,
} from "@/lib/api/types";

type CycleWithContributions = Cycle & { contributions?: Contribution[] };

export function memberDisplayName(
  member: Pick<GroupMemberWithUser, "name" | "user"> | { name?: string } | null | undefined,
): string {
  if (!member) return "Unknown";
  if ("user" in member && member.user?.name) return member.user.name;
  if ("name" in member && member.name) return member.name;
  return "Unknown";
}

export function memberStatus(
  member?: Pick<
    GroupMemberWithUser,
    "displayStatus" | "contributionStatus"
  > | null,
  fallback?: ContributionDisplayStatus,
): ContributionDisplayStatus {
  return (
    member?.displayStatus ??
    member?.contributionStatus ??
    fallback ??
    "pending"
  );
}

export function contributionDisplayStatus(
  contribution: Contribution | undefined,
): ContributionDisplayStatus {
  if (contribution?.displayStatus) return contribution.displayStatus;
  if (contribution?.status === "confirmed") return "paid";
  if (contribution?.status === "disputed") return "disputed";
  return "pending";
}

export function contributionsForCycle(
  cycle: Cycle,
  fetched: Contribution[],
): Contribution[] {
  const nested = (cycle as CycleWithContributions).contributions;
  if (nested && nested.length > 0) return nested;
  return fetched.filter((c) => c.cycleId === cycle.id);
}

export function frequencyLabel(freq: string | GroupFrequency): string {
  if (freq === "biweekly") return "Biweekly";
  if (freq === "weekly") return "Weekly";
  return "Monthly";
}

export const FREQUENCY_OPTIONS: { value: GroupFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
];

export function toGroupCardProps(group: GroupListItem) {
  const ordered = [...(group.members ?? [])].sort(
    (a, b) => (a.payoutOrder ?? 0) - (b.payoutOrder ?? 0),
  );
  const members = ordered.map((m) => ({
    id: m.userId,
    name: memberDisplayName(m as GroupMemberWithUser),
  }));
  const collectorId =
    group.whoseTurn?.id ??
    group.activeCycle?.collectorUserId ??
    members[0]?.id ??
    "";
  const collectorName =
    group.whoseTurn?.name ??
    members.find((m) => m.id === collectorId)?.name ??
    "—";
  const nextPayoutDate =
    group.nextPayoutDate ?? group.activeCycle?.periodEnd ?? "";
  const myStatus: ContributionDisplayStatus =
    group.myContributionStatus ?? "pending";

  return {
    id: group.id,
    name: group.name,
    memberCount: group.memberCount ?? group.members?.length ?? 0,
    contributionAmount: group.contributionAmount,
    frequency: group.frequency,
    members,
    collectorId,
    collectorName,
    nextPayoutDate,
    myStatus,
  };
}

export type CycleHistoryRow = {
  id: string;
  cycleNumber: number;
  collectorName: string;
  periodStart: string;
  periodEnd: string;
  status?: string;
  paidLabel?: string;
};
