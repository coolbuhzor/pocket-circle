"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const router = useRouter();

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("text-sm text-text-muted", className)}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && <span aria-hidden>/</span>}
              {item.href && !isLast ? (
                <button
                  type="button"
                  className="hover:text-primary"
                  onClick={() => router.push(item.href!)}
                >
                  {item.label}
                </button>
              ) : (
                <span className={isLast ? "text-text-muted" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
