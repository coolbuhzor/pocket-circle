"use client";

import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div
      className="flex gap-1 overflow-x-auto rounded-xl bg-primary-light/25 p-1"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97]",
            activeTab === tab.id
              ? "bg-surface text-primary shadow-sm"
              : "text-text-muted hover:bg-surface/50 hover:text-primary",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
