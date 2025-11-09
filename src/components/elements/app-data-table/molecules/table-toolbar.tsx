import { X } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { SearchInput } from "../atoms/search-input";
import { ActionButton } from "../atoms/action-button";
import { FacetedFilter } from "./faceted-filter";
import { ViewOptions } from "./view-options";
import { DataTableConfig } from "../types";

interface TableToolbarProps<TData> {
  table: Table<TData>;
  config: DataTableConfig;
  onSearch?: (value: string) => void;
}

export function TableToolbar<TData>({
  table,
  config,
  onSearch,
}: TableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Extract search config to avoid repeated null checks
  const searchConfig = config.search;
  const hasSearch = searchConfig?.enabled && searchConfig.columnKey;

  return (
    <div className="space-y-4">
      {/* Top row - Search and primary actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side - Search */}
        <div className="flex items-center space-x-2 min-w-0">
          {hasSearch && (
            <SearchInput
              placeholder={searchConfig.placeholder}
              value={
                (table
                  .getColumn(searchConfig.columnKey)
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(value) => {
                table.getColumn(searchConfig.columnKey)?.setFilterValue(value);
                onSearch?.(value);
              }}
            />
          )}
        </div>

        {/* Right side - Primary actions (always visible) */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Custom toolbar actions */}
          {config.toolbarActions}

          {/* View options */}
          {config.viewOptions?.enabled !== false && (
            <ViewOptions table={table} />
          )}
        </div>
      </div>

      {/* Bottom row - Filters (wrap when needed) */}
      {(config.filters && config.filters.length > 0) || isFiltered ? (
        <div className="flex flex-wrap items-center gap-2">
          {/* Dynamic filters */}
          {config.filters?.map((filterConfig) => {
            const column = table.getColumn(filterConfig.columnKey);
            return column ? (
              <FacetedFilter
                key={filterConfig.columnKey}
                column={column}
                title={filterConfig.title}
                options={filterConfig.options}
              />
            ) : null;
          })}

          {/* Clear filters */}
          {isFiltered && (
            <ActionButton
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </ActionButton>
          )}
        </div>
      ) : null}
    </div>
  );
}
