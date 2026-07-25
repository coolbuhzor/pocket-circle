"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import type {
  AdminEngagementStats,
  AdminFinancialStats,
  AdminGroupDetail,
  AdminGroupRow,
  AdminGrowthStats,
  AdminStatsOverview,
  AdminUserDetail,
  AdminUserRow,
  PaginatedResponse,
} from "@/lib/api/types";

function buildQuery(params: {
  page: number;
  limit: number;
  search?: string;
}) {
  const qs = new URLSearchParams();
  qs.set("page", String(params.page));
  qs.set("limit", String(params.limit));
  if (params.search) qs.set("search", params.search);
  return qs.toString();
}

export function useAdminUsers(page: number, search: string, limit = 20) {
  return useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: () =>
      apiFetch<PaginatedResponse<AdminUserRow>>(
        `admin/users?${buildQuery({ page, limit, search })}`,
      ),
  });
}

export function useAdminUser(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => apiFetch<AdminUserDetail>(`admin/users/${id}`),
    enabled: Boolean(id),
  });
}

export function useAdminGroups(page: number, search: string, limit = 20) {
  return useQuery({
    queryKey: ["admin-groups", page, search],
    queryFn: () =>
      apiFetch<PaginatedResponse<AdminGroupRow>>(
        `admin/groups?${buildQuery({ page, limit, search })}`,
      ),
  });
}

export function useAdminGroup(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-group", id],
    queryFn: () => apiFetch<AdminGroupDetail>(`admin/groups/${id}`),
    enabled: Boolean(id),
  });
}

export function useAdminStatsOverview() {
  return useQuery({
    queryKey: ["admin-stats-overview"],
    queryFn: () => apiFetch<AdminStatsOverview>("admin/stats/overview"),
  });
}

export function useAdminStatsGrowth() {
  return useQuery({
    queryKey: ["admin-stats-growth"],
    queryFn: () => apiFetch<AdminGrowthStats>("admin/stats/growth"),
  });
}

export function useAdminStatsFinancial() {
  return useQuery({
    queryKey: ["admin-stats-financial"],
    queryFn: () => apiFetch<AdminFinancialStats>("admin/stats/financial"),
  });
}

export function useAdminStatsEngagement() {
  return useQuery({
    queryKey: ["admin-stats-engagement"],
    queryFn: () => apiFetch<AdminEngagementStats>("admin/stats/engagement"),
  });
}
