"use client";

import { Suspense } from "react";
import { useAdminUsers } from "@/hooks/useAdmin";
import { useAdminListSearch } from "@/hooks/useAdminListSearch";
import { DataTable } from "@/components/ui/DataTable";
import {
  AdminListHeader,
  AdminListSuspenseFallback,
} from "@/components/admin/AdminListHeader";
import { adminUsersColumns } from "@/components/admin/usersColumns";

const PAGE_SIZE = 20;

function AdminUsersContent() {
  const { page, search, setSearch, debounced, setPage, router } =
    useAdminListSearch({ basePath: "/admin/users" });
  const { data, isLoading } = useAdminUsers(page, debounced, PAGE_SIZE);
  const items = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  return (
    <div className="space-y-4">
      <AdminListHeader
        title="Users"
        description="Search and open any account"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name or email…"
        searchLabel="Search users"
      />
      <DataTable
        columns={adminUsersColumns}
        data={items}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="No users match that search."
        minWidth="820px"
        onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          total,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<AdminListSuspenseFallback />}>
      <AdminUsersContent />
    </Suspense>
  );
}
