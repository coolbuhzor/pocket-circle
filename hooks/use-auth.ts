"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch, authFetch } from "@/lib/api/client";
import type { User } from "@/lib/api/types";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<User | null> => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return null;
      const data = (await res.json()) as { user: User | null };
      return data.user ?? null;
    },
    retry: false,
    staleTime: 30_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      authFetch<{ user: User }>("login", body),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
      void queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      firstName: string;
      lastName: string;
      middleName?: string;
      email: string;
      password: string;
      bankName: string;
      bankCode: string;
      accountNumber: string;
    }) => authFetch<{ user: User }>("signup", body),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
      void queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => authFetch("logout"),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<User>) =>
      apiFetch<User>("me", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: (user) => {
      queryClient.setQueryData(["me"], user);
      void queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
