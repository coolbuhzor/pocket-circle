"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Receipt } from "lucide-react";
import { RequireAuth } from "@/components/require-auth";
import { Tabs } from "@/components/tabs";
import { ActivityFeed } from "@/components/activity-feed";
import { EmptyState } from "@/components/empty-state";
import { ReceiptUploadModal } from "@/components/receipt-upload-modal";
import { GroupPageHeader } from "@/components/groups/group-page-header";
import { GroupOverviewTab } from "@/components/groups/group-overview-tab";
import { GroupMembersTab } from "@/components/groups/group-members-tab";
import { GroupSettingsTab } from "@/components/groups/group-settings-tab";
import { CycleHistoryTable } from "@/components/groups/cycle-history-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useGroup } from "@/hooks/use-groups";
import { useContributions, useCycleHistory } from "@/hooks/use-cycles";
import { useActivity } from "@/hooks/use-invites";
import { useGroupDetailActions } from "@/hooks/use-group-detail-actions";
import { useGroupDetailDerived } from "@/hooks/use-group-detail-derived";
import type { GroupFrequency } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

type TabId = "overview" | "members" | "activity" | "history" | "settings";

type SettingsFormState = {
  name: string;
  contributionAmount: number;
  frequency: GroupFrequency;
};

function GroupDetailContent() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;
  const { user } = useAuth();

  const {
    data: group,
    isLoading,
    isError,
    error,
    refetch,
  } = useGroup(groupId);
  const cycle = group?.activeCycle ?? null;

  const { data: cycles = [] } = useCycleHistory(groupId);
  const { data: contributions = [], refetch: refetchContributions } =
    useContributions(cycle?.id);
  const { data: activity = [] } = useActivity(groupId);

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState<SettingsFormState | null>(
    null,
  );

  const settingsForm: SettingsFormState = settingsDraft ?? {
    name: group?.name ?? "",
    contributionAmount: group?.contributionAmount ?? 0,
    frequency: group?.frequency ?? "monthly",
  };

  const derived = useGroupDetailDerived({
    group,
    user,
    cycle,
    cycles,
    contributions,
  });

  const actions = useGroupDetailActions({
    groupId,
    groupName: group?.name,
    contributionAmount: group?.contributionAmount,
    orderedMemberIds: derived.orderedMembers.map((m) => m.userId),
    nextCollectorName: derived.nextCollector?.name,
    collectorName: derived.collector?.name,
  });

  const notFound =
    isError &&
    error instanceof ApiError &&
    (error.status === 404 || error.status === 403);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "members", label: "Members" },
    { id: "activity", label: "Activity" },
    { id: "history", label: "History" },
    ...(derived.isAdmin ? [{ id: "settings", label: "Settings" }] : []),
  ];

  async function refreshOverview() {
    await Promise.all([refetch(), refetchContributions()]);
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (notFound || !group) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-16">
        <EmptyState
          icon={<Receipt className="h-6 w-6" />}
          title="Group not found"
          message="This group doesn't exist, or you're not a member. Check the link or head back to your dashboard."
          actionLabel="Back to dashboard"
          actionHref="/dashboard"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <GroupPageHeader
        className="mb-6"
        breadcrumb={[
          { label: "Groups", href: "/dashboard" },
          { label: group.name },
        ]}
        name={group.name}
        contributionAmount={group.contributionAmount}
        frequency={group.frequency}
      />

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
      />

      <div key={activeTab} className="pc-enter mt-6">
        {activeTab === "overview" && cycle && derived.collector && (
          <GroupOverviewTab
            cycle={cycle}
            group={group}
            rotationMembers={derived.rotationMembers}
            collector={derived.collector}
            currentUserId={user?.id}
            isCollector={user?.id === cycle.collectorUserId}
            isAdmin={derived.isAdmin}
            myDisplayStatus={derived.myDisplayStatus}
            myContribution={derived.myContribution}
            paymentRows={derived.paymentRows}
            nextCollector={derived.nextCollector}
            closingCycle={actions.closingCycle}
            onUpload={() => setUploadOpen(true)}
            onShareWhatsApp={actions.shareWhatsApp}
            onCloseCycle={actions.handleCloseCycle}
            onPaymentsChanged={refreshOverview}
          />
        )}

        {activeTab === "members" && (
          <GroupMembersTab
            members={derived.orderedMembers}
            rotationMembers={derived.rotationMembers}
            collectorUserId={cycle?.collectorUserId}
            currentUserId={user?.id}
            isAdminView={derived.isAdmin}
            onReorder={actions.handleReorder}
            onMakeAdmin={actions.handleMakeAdmin}
            onRemove={actions.handleRemove}
          />
        )}

        {activeTab === "activity" && <ActivityFeed events={activity} />}

        {activeTab === "history" && (
          <CycleHistoryTable
            rows={derived.historyRows}
            variant="status"
            density="comfortable"
            emptyMessage="Once a cycle finishes, you'll see who collected and who paid here."
          />
        )}

        {activeTab === "settings" && derived.isAdmin && (
          <GroupSettingsTab
            groupId={group.id}
            form={settingsForm}
            onChange={setSettingsDraft}
            inviteLink={actions.inviteLink}
            saving={actions.savingSettings}
            generatingInvite={actions.generatingInvite}
            deleting={actions.deletingGroup}
            onSave={() => actions.handleSaveSettings(settingsForm)}
            onGenerateInvite={actions.handleGenerateInvite}
            onDelete={actions.handleDeleteGroup}
          />
        )}
      </div>

      {user && cycle && derived.collector && (
        <ReceiptUploadModal
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          cycleId={cycle.id}
          groupId={group.id}
          defaultAmount={group.contributionAmount}
          collectorName={derived.collector.name}
          onSuccess={refreshOverview}
        />
      )}
    </div>
  );
}

export default function GroupDetailPage() {
  return (
    <RequireAuth>
      <GroupDetailContent />
    </RequireAuth>
  );
}
