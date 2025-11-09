// src/features/templates/index.tsx
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "./components/template-card";
import { TemplateFormModal } from "./components/template-form-modal";
import { TemplateViewModal } from "./components/template-view-modal";
import { TemplateDeleteDialog } from "./components/template-delete-dialog";
import { useTemplates } from "@/api/hooks/templates";
import { TemplateData } from "@/types/dto/template.dto";

export default function Templates() {
  // Dialog states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);

  // Fetch templates
  const { data, isLoading, error } = useTemplates();
  const responseData = data?.data as { templates: TemplateData[] } | undefined;
  const templates = responseData?.templates || [];

  // Action handlers
  const handleView = (template: TemplateData) => {
    setSelectedTemplate(template);
    setViewModalOpen(true);
  };

  const handleEdit = (template: TemplateData) => {
    setSelectedTemplate(template);
    setEditModalOpen(true);
  };

  const handleDelete = (template: TemplateData) => {
    setSelectedTemplate(template);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-[500] tracking-tight text-foreground">
            ID Card Templates
          </h1>
          <p className="text-muted-foreground">
            Manage and organize your ID card templates
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateModalOpen(true)} className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Add Template
        </Button>
      </div>

      {/* Loading/Error States */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <p className="text-destructive font-medium">Failed to load templates</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No templates found
          </h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first ID card template
          </p>
          <Button size="sm" onClick={() => setCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <TemplateFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        mode="add"
      />

      {selectedTemplate && (
        <>
          <TemplateViewModal
            open={viewModalOpen}
            onOpenChange={setViewModalOpen}
            template={selectedTemplate}
          />

          <TemplateFormModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            template={selectedTemplate}
            mode="edit"
          />

          <TemplateDeleteDialog
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            currentRow={selectedTemplate}
          />
        </>
      )}
    </div>
  );
}
