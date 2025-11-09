// src/features/submissions-lite/index.tsx
import { useState, useMemo } from "react";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createInstitutionSubmissionColumns } from "./config/columns";
import { institutionSubmissionFilters } from "./config/filters";
import { InstitutionStats } from "./components/institution-stats";
import { InstitutionSubmissionViewModal } from "./components/institution-submission-view-modal";
import { submissionListSchema, Submission } from "./data/schema";
import { institutionSubmissions } from "./data/institution-submissions.ts";

export default function InstitutionSubmissions() {
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Table state
  const tableState = useTableState<Submission>({ debounceMs: 300 });

  // TODO: Replace with API call
  const submissionList = submissionListSchema.parse(institutionSubmissions);

  // Action handlers
  const handleView = (submission: Submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  // Columns
  const columns = useMemo(() => createInstitutionSubmissionColumns(handleView), []);

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <InstitutionStats submissions={submissionList} />

      {/* Table */}
      <DataTable
        data={submissionList}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search by name, ID number, or login code...",
            columnKey: "personName",
          },
          filters: institutionSubmissionFilters,
          pagination: {
            enabled: true,
            defaultPageSize: 15,
          },
          selection: { enabled: false },
          sorting: {
            enabled: true,
            defaultSort: { columnKey: "createdAt", desc: true },
          },
          viewOptions: { enabled: true },
          emptyStateMessage: "No submissions found for your institution.",
          state: {
            sorting: tableState.state.sorting,
            columnFilters: tableState.state.filters,
            pagination: tableState.state.pagination,
          },
        }}
        callbacks={{
          onSearch: tableState.updateSearch,
          onFiltersChange: tableState.updateFilters,
          onSortingChange: tableState.updateSorting,
          onRowSelectionChange: tableState.updateSelection,
          onPaginationChange: tableState.updatePagination,
        }}
      />

      {/* View Dialog */}
      {selectedSubmission && (
        <InstitutionSubmissionViewModal
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          submission={selectedSubmission}
        />
      )}
    </div>
  );
}
