"use client";

import { RotationCircle } from "@/components/RotationCircle";
import { MemberRow } from "@/components/MemberRow";
import type {
  ContributionDisplayStatus,
  GroupMemberWithUser,
} from "@/lib/api/types";
import { memberDisplayName, memberStatus } from "@/lib/groups";

interface GroupMembersTabProps {
  members: GroupMemberWithUser[];
  rotationMembers: { id: string; name: string }[];
  collectorUserId?: string;
  currentUserId?: string;
  isAdminView: boolean;
  onReorder: (userId: string, direction: "up" | "down") => void;
  onMakeAdmin: (userId: string) => void;
  onRemove: (userId: string) => void;
  statusFor?: (member: GroupMemberWithUser) => ContributionDisplayStatus;
}

export function GroupMembersTab({
  members,
  rotationMembers,
  collectorUserId = "",
  currentUserId,
  isAdminView,
  onReorder,
  onMakeAdmin,
  onRemove,
  statusFor,
}: GroupMembersTabProps) {
  return (
    <div className="space-y-3">
      <div className="mb-4 flex justify-center sm:justify-start">
        <RotationCircle
          members={rotationMembers}
          collectorId={collectorUserId}
          size="sm"
        />
      </div>
      {members.map((m, index) => (
        <MemberRow
          key={m.userId}
          userId={m.userId}
          name={memberDisplayName(m)}
          role={m.role}
          payoutOrder={m.payoutOrder}
          status={statusFor ? statusFor(m) : memberStatus(m)}
          isCollector={m.userId === collectorUserId}
          isCurrentUser={m.userId === currentUserId}
          isAdminView={isAdminView}
          canMoveUp={index > 0}
          canMoveDown={index < members.length - 1}
          onMoveUp={() => onReorder(m.userId, "up")}
          onMoveDown={() => onReorder(m.userId, "down")}
          onMakeAdmin={() => onMakeAdmin(m.userId)}
          onRemove={() => onRemove(m.userId)}
        />
      ))}
    </div>
  );
}
