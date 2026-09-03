"use client";

import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/admin/pagination";

export type { ColumnDef };

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  getRowId?: (row: TData, index: number) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  pagination?: DataTablePagination;
  skeletonRows?: number;
  minWidth?: string;
  className?: string;
  density?: "comfortable" | "compact";
}

function columnId<TData>(
  column: ColumnDef<TData, unknown>,
  index: number,
): string {
  if (column.id) return column.id;
  if ("accessorKey" in column && column.accessorKey != null) {
    return String(column.accessorKey);
  }
  return `col-${index}`;
}

function headerLabel<TData>(column: ColumnDef<TData, unknown>): ReactNode {
  if (typeof column.header === "string") return column.header;
  return null;
}

function cellContent<TData>(
  column: ColumnDef<TData, unknown>,
  original: TData,
  index: number,
  id: string,
): ReactNode {
  if (typeof column.cell === "function") {
    const render = column.cell as (ctx: {
      row: { original: TData; index: number; id: string };
    }) => ReactNode;
    return render({ row: { original, index, id } });
  }

  if ("accessorFn" in column && typeof column.accessorFn === "function") {
    const value = column.accessorFn(original, index);
    return value == null ? null : String(value);
  }

  if ("accessorKey" in column && column.accessorKey != null) {
    const value = (original as Record<string, unknown>)[
      String(column.accessorKey)
    ];
    return value == null ? null : String(value);
  }

  return null;
}

export function DataTable<TData>({
  columns,
  data,
  getRowId,
  isLoading = false,
  emptyMessage = "No results.",
  onRowClick,
  pagination,
  skeletonRows = 8,
  minWidth = "640px",
  className,
  density = "compact",
}: DataTableProps<TData>) {
  const columnCount = columns.length;
  const cellPad = density === "comfortable" ? "px-4 py-3" : "px-3 py-2";
  const headerPad =
    density === "comfortable" ? "px-4 py-3" : "px-3 py-2.5";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-primary-light/40 bg-surface",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" style={{ minWidth }}>
          <thead className="border-b border-primary-light/40 bg-bg text-xs uppercase tracking-wide text-text-muted">
            <tr>
              {columns.map((column, index) => {
                const meta = column.meta;
                return (
                  <th
                    key={columnId(column, index)}
                    className={cn(
                      "font-medium",
                      headerPad,
                      meta?.align === "right" && "text-right",
                      meta?.className,
                    )}
                  >
                    {headerLabel(column)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="pc-stagger">
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <tr
                  key={`skeleton-${rowIndex}`}
                  className="border-b border-primary-light/20 last:border-0"
                >
                  {Array.from({ length: columnCount }).map((_, colIndex) => (
                    <td
                      key={`skeleton-${rowIndex}-${colIndex}`}
                      className={cellPad}
                    >
                      <Skeleton
                        className={cn(
                          "h-4",
                          colIndex === 0 ? "w-28" : "w-16",
                          colIndex === columnCount - 1 && "ml-auto",
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-3 py-10 text-center text-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((original, index) => {
                const id = getRowId?.(original, index) ?? String(index);
                return (
                  <tr
                    key={id}
                    className={cn(
                      "border-b border-primary-light/20 transition-colors last:border-0",
                      onRowClick && "cursor-pointer hover:bg-primary-light/10",
                    )}
                    onClick={
                      onRowClick ? () => onRowClick(original) : undefined
                    }
                  >
                    {columns.map((column, colIndex) => {
                      const meta = column.meta;
                      return (
                        <td
                          key={`${id}-${columnId(column, colIndex)}`}
                          className={cn(
                            cellPad,
                            meta?.align === "right" && "text-right",
                            meta?.className,
                          )}
                        >
                          {cellContent(column, original, index, id)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {pagination ? (
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={pagination.onPageChange}
        />
      ) : null}
    </div>
  );
}
