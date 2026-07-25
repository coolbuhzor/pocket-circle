"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, fetchPublicInvite } from "@/lib/api/client";
import type {
  ActivityEvent,
  CreateInviteResponse,
  Group,
  Invite,
  InvitePublic,
} from "@/lib/api/types";

export function useGroupInvites(groupId: string | undefined) {
  return useQuery({
    queryKey: ["invites", groupId],
    queryFn: () => apiFetch<Invite[]>(`groups/${groupId}/invites`),
    enabled: Boolean(groupId),
  });
}

export function useCreateInvite(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body?: { email?: string }) => {
      const email = body?.email?.trim();
      return apiFetch<CreateInviteResponse>(`groups/${groupId}/invites`, {
        method: "POST",
        ...(email ? { body: JSON.stringify({ email }) } : {}),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invites", groupId] });
      void queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

export function useInvite(token: string | undefined) {
  return useQuery({
    queryKey: ["invite", token],
    queryFn: () => fetchPublicInvite<InvitePublic>(token!),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useAcceptInvite(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch<Group>(`invites/${token}/accept`, { method: "POST" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useActivity(groupId: string | undefined) {
  return useQuery({
    queryKey: ["activity", groupId],
    queryFn: () => apiFetch<ActivityEvent[]>(`groups/${groupId}/activity`),
    enabled: Boolean(groupId),
  });
}
