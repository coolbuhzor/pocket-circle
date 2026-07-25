"use client";

import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { RequireAuth } from "@/components/require-auth";
import { GroupCard } from "@/components/group-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useGroups } from "@/hooks/use-groups";
import { toGroupCardProps } from "@/lib/groups";

function DashboardContent() {
  const { user } = useAuth();
  const { data: groups = [], isLoading } = useGroups();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text">
            Your groups
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Hi {user?.name.split(" ")[0]} — here&apos;s where you&apos;re saving.
          </p>
        </div>
        <Link href="/groups/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Create a group
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No groups yet"
            message="Create one and invite your friends — or ask someone to send you an invite link."
            actionLabel="Create a group"
            actionHref="/groups/new"
          />
        </div>
      ) : (
        <div className="pc-stagger mt-8 grid gap-4 sm:grid-cols-2">
          {groups.map((group) => {
            const props = toGroupCardProps(group);
            return <GroupCard key={props.id} {...props} />;
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
