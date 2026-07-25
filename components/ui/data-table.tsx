"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";
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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: getRowId
      ? (row, index) => getRowId(row, index)
      : undefined,
    manualPagination: Boolean(pagination),
  });

  const columnCount = columns.length;
  const cellPad =
    density === "comfortable" ? "px-4 py-3" : "px-3 py-2";
  const headerPad =
    density === "comfortable" ? "px-4 py-3" : "px-3 py-2.5";

  function handleRowClick(row: Row<TData>) {
    onRowClick?.(row.original);
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-primary-light/40 bg-surface",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table
          className="w-full text-left text-sm"
          style={{ minWidth }}
        >
          <thead className="border-b border-primary-light/40 bg-bg text-xs uppercase tracking-wide text-text-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "font-medium",
                        headerPad,
                        meta?.align === "right" && "text-right",
                        meta?.className,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="pc-stagger">
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <tr
                  key={`skeleton-${rowIndex}`}
                  className="border-b border-primary-light/20 last:border-0"
                >
                  {Array.from({ length: columnCount }).map((_, colIndex) => (
                    <td key={`skeleton-${rowIndex}-${colIndex}`} className={cellPad}>
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
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-3 py-10 text-center text-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-primary-light/20 transition-colors last:border-0",
                    onRowClick && "cursor-pointer hover:bg-primary-light/10",
                  )}
                  onClick={
                    onRowClick ? () => handleRowClick(row) : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          cellPad,
                          meta?.align === "right" && "text-right",
                          meta?.className,
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
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
