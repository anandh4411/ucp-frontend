import { useState, useCallback, useRef, useEffect } from "react";
import {
  ColumnFiltersState,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";

export interface TableState<TData = any> {
  search: string;
  filters: ColumnFiltersState;
  sorting: SortingState;
  pagination: PaginationState;
  selection: TData[]; // Array of selected row objects
}

export interface TableStateConfig<TData = any> {
  debounceMs?: number;
  onStateChange?: (state: TableState<TData>) => void;
}

export function useTableState<TData = any>(
  config: TableStateConfig<TData> = {}
) {
  const { debounceMs = 300, onStateChange } = config;

  const [state, setState] = useState<TableState<TData>>({
    search: "",
    filters: [],
    sorting: [],
    pagination: { pageIndex: 0, pageSize: 10 },
    selection: [],
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;

  // Debounced emit function
  const emitStateChange = useCallback(
    (newState: TableState<TData>) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onStateChangeRef.current?.(newState);
      }, debounceMs);
    },
    [debounceMs]
  );

  // Individual update functions
  const updateSearch = useCallback(
    (search: string) => {
      setState((prev) => {
        const newState = {
          ...prev,
          search,
          pagination: { ...prev.pagination, pageIndex: 0 }, // Reset to first page
        };
        emitStateChange(newState);
        return newState;
      });
    },
    [emitStateChange]
  );

  const updateFilters = useCallback(
    (filters: ColumnFiltersState) => {
      setState((prev) => {
        const newState = {
          ...prev,
          filters,
          pagination: { ...prev.pagination, pageIndex: 0 },
        };
        emitStateChange(newState);
        return newState;
      });
    },
    [emitStateChange]
  );

  const updateSorting = useCallback(
    (sorting: SortingState) => {
      setState((prev) => {
        const newState = { ...prev, sorting };
        emitStateChange(newState);
        return newState;
      });
    },
    [emitStateChange]
  );

  const updatePagination = useCallback(
    (pagination: PaginationState) => {
      setState((prev) => {
        const newState = { ...prev, pagination };
        emitStateChange(newState);
        return newState;
      });
    },
    [emitStateChange]
  );

  const updateSelection = useCallback(
    (selection: TData[]) => {
      setState((prev) => {
        const newState = { ...prev, selection };
        emitStateChange(newState);
        return newState;
      });
    },
    [emitStateChange]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    state,
    updateSearch,
    updateFilters,
    updateSorting,
    updatePagination,
    updateSelection,
  };
}
