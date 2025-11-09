import { SortingState } from "@tanstack/react-table";

export const createInitialSorting = (defaultSort?: {
  columnKey: string;
  desc: boolean;
}): SortingState => {
  return defaultSort
    ? [
        {
          id: defaultSort.columnKey,
          desc: defaultSort.desc,
        },
      ]
    : [];
};

export const getDefaultPageSize = (config?: {
  defaultPageSize?: number;
}): number => {
  return config?.defaultPageSize ?? 10;
};

export const getDefaultPageSizeOptions = (config?: {
  pageSizeOptions?: number[];
}): number[] => {
  return config?.pageSizeOptions ?? [5, 10, 20, 30, 40, 50];
};
