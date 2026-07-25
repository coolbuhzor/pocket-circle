import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminListHeaderProps {
  title: string;
  description: string;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchLabel: string;
}

export function AdminListHeader({
  title,
  description,
  search,
  onSearchChange,
  searchPlaceholder,
  searchLabel,
}: AdminListHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-semibold text-text">{title}</h2>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
      <div className="w-full max-w-xs">
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={searchLabel}
        />
      </div>
    </div>
  );
}

export function AdminListSuspenseFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
