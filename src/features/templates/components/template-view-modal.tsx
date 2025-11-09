import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  UsersIcon,
  PenIcon,
  CopyIcon,
  ImageIcon,
} from "lucide-react";
import { TemplateData } from "@/types/dto/template.dto";
import { format } from "date-fns";

interface TemplateViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: TemplateData;
  onEdit?: (template: TemplateData) => void;
  onDuplicate?: (template: TemplateData) => void;
}

export const TemplateViewModal = ({
  open,
  onOpenChange,
  template,
  onEdit,
  onDuplicate,
}: TemplateViewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold">
                {template.name}
              </DialogTitle>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(template)}
                >
                  <PenIcon className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              {onDuplicate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDuplicate(template)}
                >
                  <CopyIcon className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Image */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Template Preview
            </h4>
            <div className="aspect-[3/2] relative rounded-lg overflow-hidden bg-muted/30 border border-border">
              <img
                src={template.imageUrl}
                alt={template.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
              {/* Fallback placeholder */}
              <div className="hidden absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Image not available</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Template Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center">
                <UsersIcon className="w-4 h-4 mr-2" />
                Usage Statistics
              </h4>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Usage
                </span>
                <span className="text-sm font-medium text-foreground">
                  {(template.usageCount || 0).toLocaleString()} times
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Timeline
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium text-foreground">
                    {template.createdAt ? format(new Date(template.createdAt), "MMM dd, yyyy") : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {template.updatedAt ? format(new Date(template.updatedAt), "MMM dd, yyyy") : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
