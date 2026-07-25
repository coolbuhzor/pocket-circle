"use client";

import { useMemo } from "react";
import type {
  Contribution,
  Cycle,
  GroupDetail,
  GroupMemberWithUser,
  User,
} from "@/lib/api/types";
import {
  memberDisplayName,
  memberStatus,
  type CycleHistoryRow,
} from "@/lib/groups";

interface UseGroupDetailDerivedOptions {
  group?: GroupDetail | null;
  user?: User | null;
  cycle: Cycle | null;
  cycles: Cycle[];
  contributions: Contribution[];
}

export function useGroupDetailDerived({
  group,
  user,
  cycle,
  cycles,
  contributions,
}: UseGroupDetailDerivedOptions) {
  const isAdmin = useMemo(
    () =>
      !!group?.members.some((m) => m.userId === user?.id && m.role === "admin"),
    [group, user],
  );

  const orderedMembers = useMemo(() => {
    if (!group) return [] as GroupMemberWithUser[];
    return [...group.members].sort((a, b) => a.payoutOrder - b.payoutOrder);
  }, [group]);

  const historyRows: CycleHistoryRow[] = useMemo(
    () =>
      cycles
        .filter((c) => c.status === "completed")
        .map((c) => {
          const collectorMember = orderedMembers.find(
            (m) => m.userId === c.collectorUserId,
          );
          return {
            id: c.id,
            cycleNumber: c.cycleNumber,
            collectorName: collectorMember
              ? memberDisplayName(collectorMember)
              : "—",
            periodStart: c.periodStart,
            periodEnd: c.periodEnd,
            status: c.status,
          };
        }),
    [cycles, orderedMembers],
  );

  const rotationMembers = orderedMembers.map((m) => ({
    id: m.userId,
    name: memberDisplayName(m),
  }));

  const collector =
    group?.whoseTurn ??
    (cycle
      ? (() => {
          const m = orderedMembers.find(
            (mem) => mem.userId === cycle.collectorUserId,
          );
          if (!m) return null;
          return {
            id: m.userId,
            name: memberDisplayName(m),
            bankName: m.user?.bankName,
            accountNumber: m.user?.accountNumber,
          };
        })()
      : null);

  const nextCollector = useMemo(() => {
    if (!cycle || orderedMembers.length === 0) return null;
    const idx = orderedMembers.findIndex(
      (m) => m.userId === cycle.collectorUserId,
    );
    const next = orderedMembers[(idx + 1) % orderedMembers.length];
    return next ? { id: next.userId, name: memberDisplayName(next) } : null;
  }, [cycle, orderedMembers]);

  const myContribution = cycle
    ? contributions.find(
        (c) => c.cycleId === cycle.id && c.payerUserId === user?.id,
      )
    : null;

  const paymentRows = useMemo(() => {
    if (!cycle || !group) return [];
    return orderedMembers
      .filter((m) => m.userId !== cycle.collectorUserId)
      .map((m) => ({
        userId: m.userId,
        name: memberDisplayName(m),
        status: memberStatus(m),
        contribution: contributions.find(
          (c) => c.cycleId === cycle.id && c.payerUserId === m.userId,
        ),
      }));
  }, [cycle, group, orderedMembers, contributions]);

  const myDisplayStatus =
    group?.myContributionStatus ??
    memberStatus(
      orderedMembers.find((m) => m.userId === user?.id),
      "pending",
    );

  return {
    isAdmin,
    orderedMembers,
    historyRows,
    rotationMembers,
    collector,
    nextCollector,
    myContribution,
    paymentRows,
    myDisplayStatus,
  };
}
