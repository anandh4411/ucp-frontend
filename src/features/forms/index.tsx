// src/features/forms/index.tsx
import { useState, useMemo } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createFormColumns } from "./config/columns";
import { formFilters } from "./config/filters";
import { FormFormModal } from "./components/form-form-modal";
import { FormViewModal } from "./components/form-view-modal";
import { FormDeleteDialog } from "./components/form-delete-dialog";
import { FormBuilderDialog } from "./components/form-builder-dialog";
import { useForms } from "@/api/hooks/forms";
import { FormData } from "@/types/dto/form.dto";

export default function Forms() {
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [builderDialogOpen, setBuilderDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);

  // Table state
  const tableState = useTableState<FormData>({ debounceMs: 300 });

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
  const { data, isLoading, isFetching, error } = useForms(queryParams);
  const responseData = data?.data as { forms: FormData[]; pagination: any } | undefined;
  const formList = responseData?.forms || [];
  const pagination = responseData?.pagination;

  // Action handlers
  const handleView = (form: FormData) => {
    setSelectedForm(form);
    setViewDialogOpen(true);
  };

  const handleEdit = (form: FormData) => {
    setSelectedForm(form);
    setEditDialogOpen(true);
  };

  const handleConfigure = (form: FormData) => {
    setSelectedForm(form);
    setBuilderDialogOpen(true);
  };

  const handleDelete = (form: FormData) => {
    setSelectedForm(form);
    setDeleteDialogOpen(true);
  };

  // Columns
  const columns = useMemo(
    () => createFormColumns(handleView, handleEdit, handleConfigure, handleDelete),
    []
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-[500] tracking-tight text-foreground">
            Forms
          </h1>
          <p className="text-muted-foreground">
            Create and manage custom forms for ID card data collection.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddDialogOpen(true)} className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Add Form
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
            <p className="text-destructive font-medium">Failed to load forms</p>
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
            data={formList}
            columns={columns}
            config={{
              search: {
                enabled: true,
                placeholder: "Search forms...",
                columnKey: "name",
              },
              filters: formFilters,
              pagination: {
                enabled: true,
                defaultPageSize: 10,
              },
              selection: { enabled: true },
              sorting: {
                enabled: true,
                defaultSort: { columnKey: "updatedAt", desc: true },
              },
              viewOptions: { enabled: true },
              emptyStateMessage: "No forms found.",
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
      <FormFormModal
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
      />

      {selectedForm && (
        <>
          <FormViewModal
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            form={selectedForm}
          />

          <FormFormModal
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            form={selectedForm}
            mode="edit"
          />

          <FormBuilderDialog
            open={builderDialogOpen}
            onOpenChange={setBuilderDialogOpen}
            form={selectedForm}
          />

          <FormDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            currentRow={selectedForm}
          />
        </>
      )}
    </div>
  );
}
