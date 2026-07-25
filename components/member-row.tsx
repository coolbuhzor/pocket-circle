"use client";

import { useState, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Shield,
  Trash2,
} from "lucide-react";
import { ContributionStatusBadge } from "@/components/contribution-status-badge";
import type { ContributionDisplayStatus } from "@/lib/api/types";
import { useClickOutside } from "@/hooks/use-click-outside";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MemberRowProps {
  userId: string;
  name: string;
  role: "admin" | "member";
  payoutOrder: number;
  status: ContributionDisplayStatus;
  isCollector: boolean;
  isCurrentUser: boolean;
  isAdminView: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMakeAdmin?: () => void;
  onRemove?: () => void;
}

export function MemberRow({
  name,
  role,
  payoutOrder,
  status,
  isCollector,
  isCurrentUser,
  isAdminView,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onMakeAdmin,
  onRemove,
}: MemberRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-3 py-3 transition-all duration-300 hover:shadow-md",
        isCollector
          ? "border-accent/50 bg-accent/10"
          : "border-primary-light/30 bg-surface hover:border-primary-light/60",
      )}
    >
      <span className="font-mono text-xs font-medium text-text-muted w-6">
        #{payoutOrder}
      </span>
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          isCollector
            ? "bg-accent text-white"
            : "bg-primary-light/50 text-primary",
        )}
      >
        {getInitials(name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">
          {name}
          {isCurrentUser && (
            <span className="ml-1.5 text-xs text-text-muted">(you)</span>
          )}
        </p>
        <p className="text-xs text-text-muted">
          {isCollector ? "Whose turn" : role === "admin" ? "Admin" : "Member"}
        </p>
      </div>
      <ContributionStatusBadge status={status} />

      {isAdminView && (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-primary-light/30 hover:text-primary"
            aria-label="Member actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-20 mt-1 w-44 origin-top-right rounded-xl border border-primary-light/40 bg-surface py-1 shadow-lg animate-[pc-scale-in_.18s_ease-out]">
              {canMoveUp && (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-bg"
                  onClick={() => {
                    onMoveUp?.();
                    setMenuOpen(false);
                  }}
                >
                  <ChevronUp className="h-4 w-4" /> Move up
                </button>
              )}
              {canMoveDown && (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-bg"
                  onClick={() => {
                    onMoveDown?.();
                    setMenuOpen(false);
                  }}
                >
                  <ChevronDown className="h-4 w-4" /> Move down
                </button>
              )}
              {role !== "admin" && (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-bg"
                  onClick={() => {
                    onMakeAdmin?.();
                    setMenuOpen(false);
                  }}
                >
                  <Shield className="h-4 w-4" /> Make admin
                </button>
              )}
              {!isCurrentUser && (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-danger/5"
                  onClick={() => {
                    onRemove?.();
                    setMenuOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
