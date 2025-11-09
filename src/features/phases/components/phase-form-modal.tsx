// src/features/phases/components/phase-form-modal.tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectDropdown } from "@/components/select-dropdown";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orderedStatuses, getStatusConfig } from "../config/status-config";
import { useCreatePhase, useUpdatePhase } from "@/api/hooks/phases";
import { PhaseData } from "@/types/dto/phase.dto";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Phase name is required." }),
  description: z.string().optional(),
  institutionId: z.string().min(1, { message: "Institution is required." }),
  status: z
    .enum([
      "file-processing",
      "design-completed",
      "printing-ongoing",
      "lanyard-attachment",
      "packaging-process",
      "on-transit",
      "delivered",
    ])
    .optional(),
});

type PhaseForm = z.infer<typeof formSchema>;

// Mock institutions - in real app, fetch from API
const institutions = [
  { label: "Springfield Elementary School", value: "1" },
  { label: "TechCorp Solutions", value: "2" },
  { label: "Community Health Center", value: "3" },
];

// Convert status configs to dropdown options
const statusOptions = orderedStatuses.map((config) => ({
  label: config.label,
  value: config.value,
}));

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase?: PhaseData | null;
  mode: "add" | "edit";
}

export function PhaseFormModal({ open, onOpenChange, phase, mode }: Props) {
  const createPhase = useCreatePhase();
  const updatePhase = useUpdatePhase();

  const form = useForm<PhaseForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      institutionId: "",
      status: "file-processing",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: phase?.name || "",
        description: phase?.description || "",
        institutionId: phase?.institutionId?.toString() || "",
        status: (phase?.status as any) || "file-processing",
      });
    }
  }, [phase, open, form]);

  const watchedStatus = form.watch("status");
  const isEditing = mode === "edit";

  // Get status config for description
  const currentStatusConfig = watchedStatus
    ? getStatusConfig(watchedStatus)
    : null;

  const onSubmit = async (values: PhaseForm) => {
    const currentDate = new Date().toISOString();

    // Handle status change logic
    let statusDates = {};

    if (values.status && phase) {
      // If moving from first status to any other, set startedAt
      if (
        phase.status === "file-processing" &&
        values.status !== "file-processing"
      ) {
        statusDates = { startedAt: currentDate };
      }

      // If changing to delivered, set completedAt
      if (values.status === "delivered" && phase.status !== "delivered") {
        statusDates = {
          ...statusDates,
          completedAt: currentDate,
          // If never started, also set startedAt
          ...(phase.status === "file-processing" && { startedAt: currentDate }),
        };
      }

      // If changing from delivered back to any earlier status, remove completedAt
      if (phase.status === "delivered" && values.status !== "delivered") {
        statusDates = { completedAt: undefined };
      }
    }

    const phaseData = {
      ...values,
      id: phase?.id || `phase-${Date.now()}`,
      institutionName:
        institutions.find((inst) => inst.value === values.institutionId)
          ?.label || "",
      status: values.status || "file-processing",
      submissionCount: phase?.submissionCount || 0,
      createdAt: phase?.createdAt || currentDate,
      updatedAt: currentDate,
      // Preserve existing dates unless status change requires update
      startedAt: phase?.startedAt,
      completedAt: phase?.completedAt,
      // Apply status change date updates
      ...statusDates,
    };

    const payload = {
      name: values.name,
      description: values.description,
      institutionId: parseInt(values.institutionId),
      status: values.status || "file-processing",
      ...statusDates,
    };

    try {
      if (mode === "add") {
        await createPhase.mutateAsync(payload);
      } else if (mode === "edit" && phase?.uuid) {
        await updatePhase.mutateAsync({
          uuid: phase.uuid,
          data: payload,
        });
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit phase:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <Edit className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
            {isEditing ? "Edit Phase" : "Create New Phase"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the phase details and status below."
              : "Create a new phase to organize submissions into batches."}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form Content */}
        <ScrollArea className="max-h-[calc(85vh-180px)]">
          <div className="px-6 py-4">
            <Form {...form}>
              <form
                id="phase-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="institutionId"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Institution</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select institution"
                        items={institutions}
                        disabled={isEditing}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phase Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. First Batch - Grade 5A"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Status</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select status"
                        items={statusOptions}
                      />
                      {currentStatusConfig && (
                        <FormDescription className="text-xs">
                          {currentStatusConfig.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of this phase..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Show current phase info in edit mode */}
                {isEditing && phase && (
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    <div className="text-sm font-medium">
                      Current Phase Info:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">
                          Submissions:
                        </span>
                        <Badge variant="outline" className="ml-2">
                          {phase.submissionCount}
                        </Badge>
                      </div>
                      {phase.startedAt && (
                        <div>
                          <span className="text-muted-foreground">
                            Started:
                          </span>
                          <div className="text-muted-foreground mt-1">
                            {new Date(phase.startedAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      {phase.completedAt && (
                        <div>
                          <span className="text-muted-foreground">
                            Delivered:
                          </span>
                          <div className="text-muted-foreground mt-1">
                            {new Date(phase.completedAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        <DialogFooter className="px-6 py-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="phase-form">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update Phase" : "Create Phase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
