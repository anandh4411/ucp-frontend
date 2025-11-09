// src/features/institutions/index.tsx
import { useState, useMemo } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createInstitutionColumns } from "./config/columns";
import { InstitutionFormModal } from "./components/institution-form-modal";
import { InstitutionDeleteDialog } from "./components/institution-delete-dialog";
import { InstitutionViewModal } from "./components/institution-view-modal";
import { useInstitutions } from "@/api/hooks/institutions";
import { InstitutionData } from "@/types/dto/institution.dto";

export default function Institutions() {
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionData | null>(null);

  // Table state
  const tableState = useTableState<InstitutionData>({ debounceMs: 300 });

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
  const { data, isLoading, isFetching, error } = useInstitutions(queryParams);
  const responseData = data?.data as { institutions: InstitutionData[]; pagination: any } | undefined;
  const institutionList = responseData?.institutions || [];
  const pagination = responseData?.pagination;

  // Action handlers
  const handleView = (institution: InstitutionData) => {
    setSelectedInstitution(institution);
    setViewDialogOpen(true);
  };

  const handleEdit = (institution: InstitutionData) => {
    setSelectedInstitution(institution);
    setEditDialogOpen(true);
  };

  const handleDelete = (institution: InstitutionData) => {
    setSelectedInstitution(institution);
    setDeleteDialogOpen(true);
  };

  // Columns
  const columns = useMemo(
    () => createInstitutionColumns(handleView, handleEdit, handleDelete),
    []
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-[500] tracking-tight text-foreground">
            Institutions
          </h1>
          <p className="text-muted-foreground">
            Manage institutions and their ID card requirements here.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddDialogOpen(true)} className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Add Institution
        </Button>
      </div>

      {/* Initial Loading */}
      {isLoading && !data ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <p className="text-destructive font-medium">Failed to load institutions</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Background Fetching Indicator */}
          {isFetching && (
            <div className="absolute top-2 right-2 z-10">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          <DataTable
            data={institutionList}
            columns={columns}
            config={{
              search: {
                enabled: true,
                placeholder: "Search institutions...",
                columnKey: "name",
              },
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
              emptyStateMessage: "No institutions found.",
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
      <InstitutionFormModal
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
      />

      {selectedInstitution && (
        <>
          <InstitutionViewModal
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            institution={selectedInstitution}
          />

          <InstitutionFormModal
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            institution={selectedInstitution}
            mode="edit"
          />

          <InstitutionDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            currentRow={selectedInstitution}
          />
        </>
      )}
    </div>
  );
}
