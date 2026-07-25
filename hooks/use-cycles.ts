"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import type { Contribution, Cycle, CycleSummary } from "@/lib/api/types";

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

export function useConfirmContribution(groupId: string, cycleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contributionId: string) =>
      apiFetch(`contributions/${contributionId}/confirm`, { method: "POST" }),
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
