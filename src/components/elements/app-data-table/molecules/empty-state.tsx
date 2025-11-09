import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyStateProps {
  colSpan: number;
  message?: string;
}

export function EmptyState({
  colSpan,
  message = "No results found.",
}: EmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        {message}
      </TableCell>
    </TableRow>
  );
}
