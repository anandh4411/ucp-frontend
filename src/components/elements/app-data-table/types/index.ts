import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FilterConfig {
  columnKey: string;
  title: string;
  options: FilterOption[];
}

export interface SearchConfig {
  enabled: boolean;
  placeholder?: string;
  columnKey: string;
}

export interface PaginationConfig {
  enabled: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

export interface SelectionConfig {
  enabled: boolean;
}

export interface SortingConfig {
  enabled: boolean;
  defaultSort?: {
    columnKey: string;
    desc: boolean;
  };
}

export interface ViewOptionsConfig {
  enabled: boolean;
}

export interface DataTableConfig {
  search?: SearchConfig;
  filters?: FilterConfig[];
  pagination?: PaginationConfig;
  selection?: SelectionConfig;
  sorting?: SortingConfig;
  viewOptions?: ViewOptionsConfig;
  toolbarActions?: React.ReactNode;
  emptyStateMessage?: string;
  initialState?: {
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    rowSelection?: Record<string, boolean>;
    pagination?: PaginationState;
  };
  state?: {
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    pagination?: PaginationState;
  };
  pageCount?: number;
}

export interface DataTableCallbacks<TData> {
  onSearch?: (searchTerm: string) => void;
  onFiltersChange?: (filters: ColumnFiltersState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onRowSelectionChange?: (selectedRows: TData[]) => void; // Use actual row data
  onPaginationChange?: (pagination: PaginationState) => void;
  onRowAction?: (action: string, row: TData) => void; // New: for row actions
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  config: DataTableConfig;
  callbacks?: DataTableCallbacks<TData>;
}
