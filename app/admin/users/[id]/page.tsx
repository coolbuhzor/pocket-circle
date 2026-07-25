"use client";

import { useParams } from "next/navigation";
import { UserRound } from "lucide-react";
import { useAdminUser } from "@/hooks/use-admin";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdminUserHeader } from "@/components/admin/admin-user-header";
import {
  adminUserContributionColumns,
  adminUserGroupColumns,
} from "@/components/admin/user-detail-columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getFullName } from "@/lib/user-name";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: detail, isLoading, isError } = useAdminUser(params.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <EmptyState
        icon={<UserRound className="h-6 w-6" />}
        title="User not found"
        message="That account doesn't exist in the platform directory."
        actionLabel="Back to users"
        actionHref="/admin/users"
      />
    );
  }

  const { user, groups, contributions } = detail;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Users", href: "/admin/users" },
          { label: getFullName(user) },
        ]}
      />
      <AdminUserHeader user={user} />

      <section>
        <h3 className="mb-2 text-sm font-semibold text-text">Groups</h3>
        <DataTable
          columns={adminUserGroupColumns}
          data={groups}
          getRowId={(row) => row.id}
          emptyMessage="Not in any groups."
          minWidth="480px"
          skeletonRows={3}
        />
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-text">
          Contribution history
        </h3>
        <DataTable
          columns={adminUserContributionColumns}
          data={contributions}
          getRowId={(row) => row.id}
          emptyMessage="No contributions yet."
          minWidth="640px"
          skeletonRows={5}
        />
      </section>
    </div>
  );
}
