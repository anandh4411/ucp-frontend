import { useState, useMemo } from "react";
import {
  RowData,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableToolbar } from "../molecules/table-toolbar";
import { TablePagination } from "../molecules/table-pagination";
import { EmptyState } from "../molecules/empty-state";
import { DataTableProps } from "../types";
import { createInitialSorting, getDefaultPageSize } from "../utils/helpers";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

export function DataTable<TData>({
  columns,
  data,
  config,
  callbacks,
}: DataTableProps<TData>) {
  // Local UI state only - server state managed by parent
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Memoize stable callbacks to prevent infinite loops
  const stableCallbacks = useMemo(
    () => ({
      onSearch: callbacks?.onSearch,
      onFiltersChange: callbacks?.onFiltersChange,
      onSortingChange: callbacks?.onSortingChange,
      onRowSelectionChange: callbacks?.onRowSelectionChange,
      onPaginationChange: callbacks?.onPaginationChange,
    }),
    [
      callbacks?.onSearch,
      callbacks?.onFiltersChange,
      callbacks?.onSortingChange,
      callbacks?.onRowSelectionChange,
      callbacks?.onPaginationChange,
    ]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      // Use controlled state if provided, otherwise initialState
      sorting:
        config.state?.sorting ??
        config.initialState?.sorting ??
        createInitialSorting(config.sorting?.defaultSort),
      columnVisibility, // This stays local
      rowSelection: config.initialState?.rowSelection || {},
      columnFilters: config.state?.columnFilters ?? config.initialState?.columnFilters ?? [],
      pagination: config.state?.pagination ?? config.initialState?.pagination ?? {
        pageIndex: 0,
        pageSize: getDefaultPageSize(config.pagination),
      },
    },
    pageCount: config.pageCount,
    enableRowSelection: config.selection?.enabled ?? false,
    enableSorting: config.sorting?.enabled ?? true,

    // Row selection handler - passes actual row data
    onRowSelectionChange: (updater) => {
      const currentSelection = config.initialState?.rowSelection || {};
      const newSelection =
        typeof updater === "function" ? updater(currentSelection) : updater;

      // Get actual selected row data instead of just IDs
      const selectedRows = Object.keys(newSelection)
        .filter((key) => newSelection[key])
        .map((index) => data[parseInt(index)])
        .filter(Boolean); // Remove any undefined entries

      stableCallbacks.onRowSelectionChange?.(selectedRows);
    },

    // Sorting handler
    onSortingChange: (updater) => {
      const currentSorting = config.state?.sorting ?? config.initialState?.sorting ?? [];
      const newSorting =
        typeof updater === "function" ? updater(currentSorting) : updater;

      stableCallbacks.onSortingChange?.(newSorting);
    },

    // Filters handler
    onColumnFiltersChange: (updater) => {
      const currentFilters = config.state?.columnFilters ?? config.initialState?.columnFilters ?? [];
      const newFilters =
        typeof updater === "function" ? updater(currentFilters) : updater;

      stableCallbacks.onFiltersChange?.(newFilters);
    },

    // Pagination handler
    onPaginationChange: (updater) => {
      const currentPagination = config.state?.pagination ?? config.initialState?.pagination ?? {
        pageIndex: 0,
        pageSize: getDefaultPageSize(config.pagination),
      };
      const newPagination =
        typeof updater === "function" ? updater(currentPagination) : updater;

      stableCallbacks.onPaginationChange?.(newPagination);
    },

    // Column visibility stays local
    onColumnVisibilityChange: setColumnVisibility,

    // Table models
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    // Manual control for server-side operations
    manualPagination: !!callbacks?.onPaginationChange,
    manualSorting: !!callbacks?.onSortingChange,
    manualFiltering: !!callbacks?.onFiltersChange,
  });

  return (
    <div className="space-y-4">
      <TableToolbar table={table} config={config} onSearch={stableCallbacks.onSearch} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.className ?? ""}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group/row hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ""}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <EmptyState
                colSpan={columns.length}
                message={config.emptyStateMessage}
              />
            )}
          </TableBody>
        </Table>
      </div>

      {config.pagination?.enabled !== false && (
        <TablePagination table={table} config={config.pagination} />
      )}
    </div>
  );
}
