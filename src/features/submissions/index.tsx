// src/features/submissions/index.tsx
import { useState, useMemo } from "react";
import { Plus, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createSubmissionColumns } from "./config/columns";
import { submissionFilters } from "./config/filters";
import { SubmissionViewModal } from "./components/submission-view-modal";
import { SubmissionDeleteDialog } from "./components/submission-delete-dialog";
import { SubmissionManualAddDialog } from "./components/submission-manual-add-dialog";
import { SubmissionImportDialog } from "./components/submission-import-dialog";
import { SubmissionAddToPhaseDialog } from "./components/submission-add-to-phase-dialog";
import { useSubmissions } from "@/api/hooks/submissions";
import { SubmissionData } from "@/types/dto/submission.dto";

export default function Submissions() {
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [manualAddDialogOpen, setManualAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [addToPhaseDialogOpen, setAddToPhaseDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionData | null>(null);
  const [bulkSelectedSubmissions, setBulkSelectedSubmissions] = useState<
    SubmissionData[]
  >([]);

  // Table state
  const tableState = useTableState<SubmissionData>({ debounceMs: 300 });

  // Build API query params
  const queryParams = useMemo(() => ({
    page: tableState.state.pagination.pageIndex + 1,
    pageSize: tableState.state.pagination.pageSize,
    search: tableState.state.search || undefined,
    sortBy: tableState.state.sorting[0]?.id || "createdAt",
    sortOrder: (tableState.state.sorting[0]?.desc ? "desc" : "asc") as "asc" | "desc",
  }), [
    tableState.state.pagination.pageIndex,
    tableState.state.pagination.pageSize,
    tableState.state.search,
    tableState.state.sorting,
  ]);

  // Fetch data
  const { data, isLoading, isFetching, error } = useSubmissions(queryParams);
  const responseData = data?.data as { submissions: SubmissionData[]; pagination: any } | undefined;
  const submissionList = responseData?.submissions || [];
  const pagination = responseData?.pagination;

  // Action handlers
  const handleView = (submission: SubmissionData) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleDownloadImage = (submission: SubmissionData) => {
    // TODO: API call to download image
    console.log("Download image for:", submission.id);
  };

  const handleDelete = (submission: SubmissionData) => {
    setSelectedSubmission(submission);
    setDeleteDialogOpen(true);
  };

  const handleAddToPhase = (submission: SubmissionData) => {
    setSelectedSubmission(submission);
    setBulkSelectedSubmissions([submission]);
    setAddToPhaseDialogOpen(true);
  };

  const handleBulkAddToPhase = () => {
    const selected = tableState.state.selection;
    if (selected.length > 0) {
      setBulkSelectedSubmissions(selected);
      setAddToPhaseDialogOpen(true);
    }
  };

  // Columns
  const columns = useMemo(
    () =>
      createSubmissionColumns(
        handleView,
        handleDownloadImage,
        handleDelete,
        handleAddToPhase
      ),
    []
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-[500] tracking-tight text-foreground">
            Submissions
          </h1>
          <p className="text-muted-foreground">
            View and manage all ID card submissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setImportDialogOpen(true)}
            className="h-9"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setManualAddDialogOpen(true)}
            className="h-9"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Submission
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {tableState.state.selection.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm text-muted-foreground">
            {tableState.state.selection.length} selected
          </span>
          <Button size="sm" variant="outline" onClick={handleBulkAddToPhase}>
            Add to Phase
          </Button>
        </div>
      )}

      {/* Loading/Error States */}
      {isLoading && !data ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <p className="text-destructive font-medium">Failed to load submissions</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute top-2 right-2 z-10">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          <DataTable
            data={submissionList}
            columns={columns}
            config={{
              search: {
            enabled: true,
            placeholder: "Search submissions...",
            columnKey: "personName",
          },
          filters: submissionFilters,
          pagination: {
            enabled: true,
            defaultPageSize: 10,
          },
          selection: { enabled: true },
          sorting: {
            enabled: true,
            defaultSort: { columnKey: "submittedAt", desc: true },
          },
          viewOptions: { enabled: true },
          emptyStateMessage: "No submissions found.",
          state: {
            sorting: tableState.state.sorting,
            columnFilters: tableState.state.filters,
            pagination: tableState.state.pagination,
          },
          pageCount: pagination?.totalPages ?? -1,
        }}
        callbacks={{
          onSearch: tableState.updateSearch,
          onFiltersChange: tableState.updateFilters,
          onSortingChange: tableState.updateSorting,
          onRowSelectionChange: tableState.updateSelection,
          onPaginationChange: tableState.updatePagination,
        }}
      />
        </div>
      )}

      {/* Dialogs */}
      <SubmissionManualAddDialog
        open={manualAddDialogOpen}
        onOpenChange={setManualAddDialogOpen}
      />

      <SubmissionImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />

      <SubmissionAddToPhaseDialog
        open={addToPhaseDialogOpen}
        onOpenChange={setAddToPhaseDialogOpen}
        submissions={bulkSelectedSubmissions}
      />

      {selectedSubmission && (
        <>
          <SubmissionViewModal
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            submission={selectedSubmission}
          />

          <SubmissionDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            currentRow={selectedSubmission}
          />
        </>
      )}
    </div>
  );
}
