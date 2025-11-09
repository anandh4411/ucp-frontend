// src/features/phases/index.tsx
import { useState, useMemo } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createPhaseColumns } from "./config/columns";
import { phaseFilters } from "./config/filters";
import { PhaseFormModal } from "./components/phase-form-modal";
import { PhaseViewModal } from "./components/phase-view-modal";
import { PhaseDeleteDialog } from "./components/phase-delete-dialog";
import { usePhases } from "@/api/hooks/phases";
import { PhaseData } from "@/types/dto/phase.dto";

export default function Phases() {
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<PhaseData | null>(null);

  // Table state
  const tableState = useTableState<PhaseData>({ debounceMs: 300 });

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
  const { data, isLoading, isFetching, error } = usePhases(queryParams);
  const responseData = data?.data as { phases: PhaseData[]; pagination: any } | undefined;
  const phaseList = responseData?.phases || [];
  const pagination = responseData?.pagination;

  // Action handlers
  const handleView = (phase: PhaseData) => {
    setSelectedPhase(phase);
    setViewDialogOpen(true);
  };

  const handleEdit = (phase: PhaseData) => {
    setSelectedPhase(phase);
    setEditDialogOpen(true);
  };

  const handleDelete = (phase: PhaseData) => {
    setSelectedPhase(phase);
    setDeleteDialogOpen(true);
  };

  const handleViewSubmissions = (_phase: PhaseData) => {
    // TODO: Navigate to submissions view filtered by phase
    console.log("View submissions for phase");
  };

  // Columns
  const columns = useMemo(
    () => createPhaseColumns(handleView, handleEdit, handleDelete, handleViewSubmissions),
    []
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-[500] tracking-tight text-foreground">
            Phase Management
          </h1>
          <p className="text-muted-foreground">
            Organize submissions into phases and track progress.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddDialogOpen(true)} className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Add Phase
        </Button>
      </div>

      {/* Loading/Error States */}
      {isLoading && !data ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <p className="text-destructive font-medium">Failed to load phases</p>
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
            data={phaseList}
            columns={columns}
            config={{
              search: {
                enabled: true,
                placeholder: "Search phases...",
                columnKey: "name",
              },
              filters: phaseFilters,
              pagination: {
                enabled: true,
                defaultPageSize: 10,
              },
              selection: { enabled: true },
              sorting: {
                enabled: true,
                defaultSort: { columnKey: "createdAt", desc: true },
              },
              viewOptions: { enabled: true },
              emptyStateMessage: "No phases found.",
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
      <PhaseFormModal
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
      />

      {selectedPhase && (
        <>
          <PhaseViewModal
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            phase={selectedPhase}
          />

          <PhaseFormModal
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            phase={selectedPhase}
            mode="edit"
          />

          <PhaseDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            currentRow={selectedPhase}
          />
        </>
      )}
    </div>
  );
}
