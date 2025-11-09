// src/features/forms/components/form-view-modal.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar, Upload, FileText } from "lucide-react";
import { format } from "date-fns";
import { FormData } from "@/types/dto/form.dto";

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: { label: string; value: string }[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: FormData;
}

export function FormViewModal({ open, onOpenChange, form }: Props) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), "PPP");
  };

  const renderField = (field: any) => {
    const baseProps = {
      id: field.id,
      required: field.required,
    };

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              {...baseProps}
              type={field.type}
              placeholder={field.placeholder}
              disabled
            />
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Textarea
              {...baseProps}
              placeholder={field.placeholder}
              disabled
              className="resize-none"
            />
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: any) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="relative">
              <Input {...baseProps} type="date" disabled />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      case "file":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-4">
              <div className="text-center space-y-2">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload file
                </p>
              </div>
            </div>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle>Form Details</DialogTitle>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Form Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{form.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {form.institutionName}
                </p>
              </div>
            </div>

            {form.description && (
              <p className="text-sm text-muted-foreground">
                {form.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {formatDate(form.createdAt)}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{" "}
                {formatDate(form.updatedAt)}
              </div>
              <div>
                <span className="font-medium">Fields:</span>{" "}
                {form.fields?.length || 0} fields
              </div>
            </div>
          </div>

          <Separator />

          {/* Form Fields Preview */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Form Fields</h3>

            {!form.fields || form.fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4" />
                <p>No fields configured yet</p>
                <p className="text-sm">Use the form builder to add fields</p>
              </div>
            ) : (
              <div className="space-y-4 bg-muted/30 p-6 rounded-lg">
                {(form.fields as any[])
                  .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                  .map((field: any) => renderField(field))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
