"use client";

import { useMemo } from "react";
import type {
  Contribution,
  Cycle,
  User,
} from "@/lib/api/types";
import type {
  AdminMemberRow,
  AdminPaymentRow,
} from "@/components/admin/AdminGroupTabs";
import {
  contributionDisplayStatus,
  contributionsForCycle,
  memberDisplayName,
  type CycleHistoryRow,
} from "@/lib/groups";

type AdminMember = {
  userId: string;
  role: "admin" | "member";
  payoutOrder: number;
  user?: User;
};

interface UseAdminGroupDerivedOptions {
  members: AdminMember[];
  cycles: Cycle[];
  cycle: Cycle | null;
  contributions: Contribution[];
  currentUserId?: string;
}

export function useAdminGroupDerived({
  members,
  cycles,
  cycle,
  contributions,
  currentUserId,
}: UseAdminGroupDerivedOptions) {
  const isMember = useMemo(
    () => !!currentUserId && members.some((m) => m.userId === currentUserId),
    [members, currentUserId],
  );

  const orderedMembers = useMemo(
    () => [...members].sort((a, b) => a.payoutOrder - b.payoutOrder),
    [members],
  );

  const rotationMembers = orderedMembers.map((m) => ({
    id: m.userId,
    name: memberDisplayName(m.user),
  }));

  const collector = cycle
    ? (orderedMembers.find((m) => m.userId === cycle.collectorUserId)?.user ??
      null)
    : null;

  const paymentRows: AdminPaymentRow[] = useMemo(() => {
    if (!cycle) return [];
    return orderedMembers
      .filter((m) => m.userId !== cycle.collectorUserId)
      .map((m) => {
        const contribution = contributions.find(
          (c) => c.cycleId === cycle.id && c.payerUserId === m.userId,
        );
        return {
          userId: m.userId,
          name: memberDisplayName(m.user),
          status: contributionDisplayStatus(contribution),
          amount: contribution?.amount ?? null,
        };
      });
  }, [cycle, orderedMembers, contributions]);

  const memberRows: AdminMemberRow[] = useMemo(() => {
    return orderedMembers.map((m) => {
      const contribution = cycle
        ? contributions.find(
            (c) => c.cycleId === cycle.id && c.payerUserId === m.userId,
          )
        : undefined;
      return {
        userId: m.userId,
        payoutOrder: m.payoutOrder,
        name: memberDisplayName(m.user),
        role: m.role,
        isCollector: m.userId === cycle?.collectorUserId,
        status: contributionDisplayStatus(contribution),
      };
    });
  }, [orderedMembers, cycle, contributions]);

  const historyRows: CycleHistoryRow[] = useMemo(() => {
    return cycles
      .filter((c) => c.status === "completed")
      .map((c) => {
        const cycleContributions = contributionsForCycle(c, contributions);
        const paidCount = cycleContributions.filter(
          (co) => co.status === "confirmed",
        ).length;
        const total = members.length - 1;
        const collectorMember = orderedMembers.find(
          (m) => m.userId === c.collectorUserId,
        );
        return {
          id: c.id,
          cycleNumber: c.cycleNumber,
          collectorName: collectorMember
            ? memberDisplayName(collectorMember.user)
            : "—",
          periodStart: c.periodStart,
          periodEnd: c.periodEnd,
          paidLabel: `${paidCount}/${Math.max(total, 0)}`,
        };
      });
  }, [cycles, contributions, members.length, orderedMembers]);

  return {
    isMember,
    rotationMembers,
    collector,
    paymentRows,
    memberRows,
    historyRows,
  };
}
