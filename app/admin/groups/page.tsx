"use client";

import { Suspense } from "react";
import { useAdminGroups } from "@/hooks/use-admin";
import { useAdminListSearch } from "@/hooks/use-admin-list-search";
import { DataTable } from "@/components/ui/data-table";
import {
  AdminListHeader,
  AdminListSuspenseFallback,
} from "@/components/admin/admin-list-header";
import { adminGroupsColumns } from "@/components/admin/groups-columns";

const PAGE_SIZE = 20;

function AdminGroupsContent() {
  const { page, search, setSearch, debounced, setPage, router } =
    useAdminListSearch({ basePath: "/admin/groups" });
  const { data, isLoading } = useAdminGroups(page, debounced, PAGE_SIZE);
  const items = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  return (
    <div className="space-y-4">
      <AdminListHeader
        title="Groups"
        description="Browse every circle on the platform"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search groups…"
        searchLabel="Search groups"
      />
      <DataTable
        columns={adminGroupsColumns}
        data={items}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="No groups match that search."
        minWidth="820px"
        onRowClick={(row) => router.push(`/admin/groups/${row.id}`)}
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

export default function AdminGroupsPage() {
  return (
    <Suspense fallback={<AdminListSuspenseFallback />}>
      <AdminGroupsContent />
    </Suspense>
  );
}
