"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import type {
  Group,
  GroupDetail,
  GroupFrequency,
  GroupListItem,
} from "@/lib/api/types";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => apiFetch<GroupListItem[]>("groups"),
  });
}

export function useGroup(id: string | undefined) {
  return useQuery({
    queryKey: ["group", id],
    queryFn: () => apiFetch<GroupDetail>(`groups/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      name: string;
      contributionAmount: number;
      frequency: GroupFrequency;
      memberEmails?: string[];
    }) =>
      apiFetch<Group>("groups", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useUpdateGroup(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      name?: string;
      contributionAmount?: number;
      frequency?: GroupFrequency;
    }) =>
      apiFetch<Group>(`groups/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["group", id] });
      void queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useDeleteGroup(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () =>
      apiFetch(`groups/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["groups"] });
      router.push("/dashboard");
    },
  });
}

export function useReorderMembers(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedUserIds: string[]) =>
      apiFetch(`groups/${groupId}/members/reorder`, {
        method: "POST",
        body: JSON.stringify({ orderedUserIds }),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

export function useMakeAdmin(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apiFetch(`groups/${groupId}/members/${userId}/make-admin`, {
        method: "POST",
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

export function useRemoveMember(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apiFetch(`groups/${groupId}/members/${userId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}
