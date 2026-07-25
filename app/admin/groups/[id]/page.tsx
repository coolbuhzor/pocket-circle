"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Receipt } from "lucide-react";
import { Tabs } from "@/components/tabs";
import { ActivityFeed } from "@/components/activity-feed";
import { EmptyState } from "@/components/empty-state";
import { GroupPageHeader } from "@/components/groups/group-page-header";
import { CycleHistoryTable } from "@/components/groups/cycle-history-table";
import {
  AdminGroupMembersTab,
  AdminGroupOverviewTab,
  AdminNotMemberBanner,
} from "@/components/admin/admin-group-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useAdminGroup } from "@/hooks/use-admin";
import { useActivity } from "@/hooks/use-invites";
import { useContributions, useCycleHistory } from "@/hooks/use-cycles";
import { useAdminGroupDerived } from "@/hooks/use-admin-group-derived";

type TabId = "overview" | "members" | "history" | "activity";

export default function AdminGroupDetailPage() {
  const params = useParams<{ id: string }>();
  const groupId = params.id;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const { data: group, isLoading, isError } = useAdminGroup(groupId);
  const { data: cycleHistory = [] } = useCycleHistory(groupId);
  const { data: activity = [] } = useActivity(groupId);

  const members = group?.members ?? [];
  const cycles =
    group?.cycles && group.cycles.length > 0 ? group.cycles : cycleHistory;
  const cycle = cycles.find((c) => c.status === "active") ?? null;
  const { data: contributions = [] } = useContributions(cycle?.id);

  const derived = useAdminGroupDerived({
    members,
    cycles,
    cycle,
    contributions,
    currentUserId: user?.id,
  });

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "members", label: "Members" },
    { id: "history", label: "History" },
    { id: "activity", label: "Activity" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !group) {
    return (
      <EmptyState
        icon={<Receipt className="h-6 w-6" />}
        title="Group not found"
        message="This group doesn't exist in the platform directory."
        actionLabel="Back to groups"
        actionHref="/admin/groups"
      />
    );
  }

  return (
    <div className="space-y-5">
      {!derived.isMember && <AdminNotMemberBanner />}

      <GroupPageHeader
        breadcrumb={[
          { label: "Groups", href: "/admin/groups" },
          { label: group.name },
        ]}
        name={group.name}
        contributionAmount={group.contributionAmount}
        frequency={group.frequency}
        titleAs="h2"
      />

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
      />

      <div key={activeTab} className="pc-enter">
        {activeTab === "overview" && (
          <AdminGroupOverviewTab
            cycle={cycle}
            rotationMembers={derived.rotationMembers}
            collector={derived.collector}
            paymentRows={derived.paymentRows}
          />
        )}

        {activeTab === "members" && (
          <AdminGroupMembersTab
            rotationMembers={derived.rotationMembers}
            collectorUserId={cycle?.collectorUserId}
            memberRows={derived.memberRows}
          />
        )}

        {activeTab === "history" && (
          <CycleHistoryTable
            rows={derived.historyRows}
            variant="paid"
            className="rounded-lg shadow-none"
            emptyMessage="Once a cycle finishes, history appears here."
          />
        )}

        {activeTab === "activity" && <ActivityFeed events={activity} />}
      </div>
    </div>
  );
}
