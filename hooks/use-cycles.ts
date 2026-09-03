"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import type {
  Contribution,
  ContributionDisplayStatus,
  ContributionStatus,
  Cycle,
  CycleSummary,
  GroupDetail,
} from "@/lib/api/types";

export function useCycleHistory(groupId: string | undefined) {
  return useQuery({
    queryKey: ["cycles", groupId],
    queryFn: () => apiFetch<Cycle[]>(`groups/${groupId}/cycles`),
    enabled: Boolean(groupId),
  });
}

export function useActiveCycle(groupId: string | undefined) {
  return useQuery({
    queryKey: ["active-cycle", groupId],
    queryFn: () => apiFetch<Cycle>(`groups/${groupId}/cycles/active`),
    enabled: Boolean(groupId),
  });
}

export function useCloseCycle(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch(`groups/${groupId}/cycles/close`, { method: "POST" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      void queryClient.invalidateQueries({ queryKey: ["cycles", groupId] });
      void queryClient.invalidateQueries({ queryKey: ["active-cycle", groupId] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });
}

export function useCycleSummary(cycleId: string | undefined) {
  return useQuery({
    queryKey: ["cycle-summary", cycleId],
    queryFn: () => apiFetch<CycleSummary>(`cycles/${cycleId}/summary`),
    enabled: Boolean(cycleId),
  });
}

export function useContributions(cycleId: string | undefined) {
  return useQuery({
    queryKey: ["contributions", cycleId],
    queryFn: () => apiFetch<Contribution[]>(`cycles/${cycleId}/contributions`),
    enabled: Boolean(cycleId),
  });
}

export function useUploadContribution(cycleId: string, groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<Contribution>(`cycles/${cycleId}/contributions`, {
        method: "POST",
        body: formData,
        formData: true,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      void queryClient.invalidateQueries({
        queryKey: ["contributions", cycleId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["cycle-summary", cycleId],
      });
    },
  });
}

type ContributionReviewSnapshot = {
  contributions?: Contribution[];
  group?: GroupDetail;
  summary?: CycleSummary;
};

function patchContributionStatus(
  contributions: Contribution[] | undefined,
  contributionId: string,
  patch: Partial<Contribution> & {
    status: ContributionStatus;
    displayStatus: ContributionDisplayStatus;
  },
): Contribution[] | undefined {
  if (!contributions) return contributions;
  return contributions.map((c) =>
    c.id === contributionId ? { ...c, ...patch } : c,
  );
}

function patchMemberDisplayStatus(
  group: GroupDetail | undefined,
  payerUserId: string | undefined,
  displayStatus: ContributionDisplayStatus,
): GroupDetail | undefined {
  if (!group || !payerUserId) return group;
  return {
    ...group,
    members: group.members.map((m) =>
      m.userId === payerUserId
        ? { ...m, displayStatus, contributionStatus: displayStatus }
        : m,
    ),
  };
}

function patchCycleSummaryStatus(
  summary: CycleSummary | undefined,
  contributionId: string,
  payerUserId: string | undefined,
  displayStatus: ContributionDisplayStatus,
  contributionPatch: Partial<Contribution>,
): CycleSummary | undefined {
  if (!summary) return summary;

  const patchRows = (rows: CycleSummary["rows"]) =>
    rows?.map((row) => {
      const matchesContribution = row.contribution?.id === contributionId;
      const matchesPayer =
        !!payerUserId &&
        (row.userId === payerUserId ||
          row.contribution?.payerUserId === payerUserId);
      if (!matchesContribution && !matchesPayer) return row;
      return {
        ...row,
        displayStatus,
        contribution: row.contribution
          ? { ...row.contribution, ...contributionPatch, displayStatus }
          : row.contribution,
      };
    });

  return {
    ...summary,
    rows: patchRows(summary.rows),
    members: patchRows(summary.members),
  };
}

async function snapshotContributionReviewCaches(
  queryClient: QueryClient,
  groupId: string,
  cycleId: string,
): Promise<ContributionReviewSnapshot> {
  await Promise.all([
    queryClient.cancelQueries({ queryKey: ["contributions", cycleId] }),
    queryClient.cancelQueries({ queryKey: ["group", groupId] }),
    queryClient.cancelQueries({ queryKey: ["cycle-summary", cycleId] }),
  ]);

  return {
    contributions: queryClient.getQueryData<Contribution[]>([
      "contributions",
      cycleId,
    ]),
    group: queryClient.getQueryData<GroupDetail>(["group", groupId]),
    summary: queryClient.getQueryData<CycleSummary>(["cycle-summary", cycleId]),
  };
}

function restoreContributionReviewCaches(
  queryClient: QueryClient,
  groupId: string,
  cycleId: string,
  snapshot?: ContributionReviewSnapshot,
) {
  if (!snapshot) return;
  if (snapshot.contributions !== undefined) {
    queryClient.setQueryData(
      ["contributions", cycleId],
      snapshot.contributions,
    );
  }
  if (snapshot.group !== undefined) {
    queryClient.setQueryData(["group", groupId], snapshot.group);
  }
  if (snapshot.summary !== undefined) {
    queryClient.setQueryData(["cycle-summary", cycleId], snapshot.summary);
  }
}

function applyContributionReviewOptimistic(
  queryClient: QueryClient,
  groupId: string,
  cycleId: string,
  contributionId: string,
  status: ContributionStatus,
  displayStatus: ContributionDisplayStatus,
  extra: Partial<Contribution> = {},
) {
  const previous = queryClient.getQueryData<Contribution[]>([
    "contributions",
    cycleId,
  ]);
  const target = previous?.find((c) => c.id === contributionId);
  const patch = { status, displayStatus, ...extra };

  queryClient.setQueryData(
    ["contributions", cycleId],
    patchContributionStatus(previous, contributionId, patch),
  );
  queryClient.setQueryData(
    ["group", groupId],
    patchMemberDisplayStatus(
      queryClient.getQueryData<GroupDetail>(["group", groupId]),
      target?.payerUserId,
      displayStatus,
    ),
  );
  queryClient.setQueryData(
    ["cycle-summary", cycleId],
    patchCycleSummaryStatus(
      queryClient.getQueryData<CycleSummary>(["cycle-summary", cycleId]),
      contributionId,
      target?.payerUserId,
      displayStatus,
      patch,
    ),
  );
}

export function useConfirmContribution(groupId: string, cycleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contributionId: string) =>
      apiFetch(`contributions/${contributionId}/confirm`, { method: "POST" }),
    onMutate: async (contributionId) => {
      const snapshot = await snapshotContributionReviewCaches(
        queryClient,
        groupId,
        cycleId,
      );
      applyContributionReviewOptimistic(
        queryClient,
        groupId,
        cycleId,
        contributionId,
        "confirmed",
        "paid",
        {
          reviewedAt: new Date().toISOString(),
          disputeReason: undefined,
        },
      );
      return snapshot;
    },
    onError: (_err, _contributionId, snapshot) => {
      restoreContributionReviewCaches(queryClient, groupId, cycleId, snapshot);
    },
    onSuccess: () => {
      // Confirm can silently auto-close the cycle — invalidate the same
      // surfaces as useCloseCycle, plus contribution/summary for this cycle.
      void queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      void queryClient.invalidateQueries({ queryKey: ["cycles", groupId] });
      void queryClient.invalidateQueries({
        queryKey: ["active-cycle", groupId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["contributions", cycleId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["cycle-summary", cycleId],
      });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });
}

export function useDisputeContribution(groupId: string, cycleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contributionId,
      reason,
    }: {
      contributionId: string;
      reason: string;
    }) =>
      apiFetch(`contributions/${contributionId}/dispute`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
    onMutate: async ({ contributionId, reason }) => {
      const snapshot = await snapshotContributionReviewCaches(
        queryClient,
        groupId,
        cycleId,
      );
      applyContributionReviewOptimistic(
        queryClient,
        groupId,
        cycleId,
        contributionId,
        "disputed",
        "disputed",
        {
          disputeReason: reason,
          reviewedAt: new Date().toISOString(),
        },
      );
      return snapshot;
    },
    onError: (_err, _vars, snapshot) => {
      restoreContributionReviewCaches(queryClient, groupId, cycleId, snapshot);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      void queryClient.invalidateQueries({
        queryKey: ["contributions", cycleId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["cycle-summary", cycleId],
      });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });
}

export function useSendReminder(cycleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (toUserId: string) =>
      apiFetch(`cycles/${cycleId}/reminders`, {
        method: "POST",
        body: JSON.stringify({ toUserId }),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });
}
