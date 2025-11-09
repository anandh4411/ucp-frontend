import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontalIcon,
  PenIcon,
  TrashIcon,
  EyeIcon,
  UsersIcon,
  CalendarIcon,
  ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TemplateData } from "@/types/dto/template.dto";
import { format } from "date-fns";

interface TemplateCardProps {
  template: TemplateData;
  onEdit: (template: TemplateData) => void;
  onDelete: (template: TemplateData) => void;
  onView: (template: TemplateData) => void;
}

export const TemplateCard = ({
  template,
  onEdit,
  onDelete,
  onView,
}: TemplateCardProps) => {
  return (
    <Card className="group relative overflow-hidden border border-border bg-gradient-to-br from-background to-background/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <ImageIcon className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-[600] text-foreground leading-tight line-clamp-1">
                {template.name}
              </CardTitle>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(template)}>
                <PenIcon className="mr-2 h-4 w-4" />
                Edit Template
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(template)}
                className="text-red-600 dark:text-red-400"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Template Image Preview */}
        <div className="aspect-[3/2] relative rounded-lg overflow-hidden bg-muted/30 border border-border/50">
          <img
            src={template.imageUrl}
            alt={template.name}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              // Fallback for broken images
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          {/* Fallback placeholder */}
          <div className="hidden absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center text-muted-foreground">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        </div>

        {/* Template info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-muted-foreground">
              <UsersIcon className="h-3 w-3 mr-2" />
              Usage Count
            </span>
            <span className="font-medium text-foreground">
              {(template.usageCount || 0).toLocaleString()} times
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-muted-foreground">
              <CalendarIcon className="h-3 w-3 mr-2" />
              Last Updated
            </span>
            <span className="font-medium text-foreground">
              {template.updatedAt ? format(new Date(template.updatedAt), "MMM dd, yyyy") : 'N/A'}
            </span>
          </div>
        </div>

        {/* Created date */}
        <div className="flex items-center justify-between text-sm py-2 px-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
          <span className="text-muted-foreground">Created</span>
          <span className="font-[600] text-foreground">
            {template.createdAt ? format(new Date(template.createdAt), "MMM dd, yyyy") : 'N/A'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(template)}
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(template)}
          >
            <PenIcon className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
