// src/features/submissions/components/submission-add-to-phase-dialog.tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layers, Save, Search, Users } from "lucide-react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { SelectDropdown } from "@/components/select-dropdown";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubmissionData } from "@/types/dto/submission.dto";

const formSchema = z.object({
  phaseId: z.string().min(1, { message: "Phase is required." }),
});

type AddToPhaseForm = z.infer<typeof formSchema>;

// Mock phases - in real app, fetch from API based on institution
const getAvailablePhases = (institutionId: string) => {
  const allPhases = [
    {
      label: "First Batch - Grade 5A",
      value: "phase-1",
      institutionId: "1",
      status: "completed",
      submissionCount: 50,
    },
    {
      label: "Second Batch - Grades 3B & 4A",
      value: "phase-2",
      institutionId: "1",
      status: "in-progress",
      submissionCount: 35,
    },
    {
      label: "Engineering Department Batch 1",
      value: "phase-3",
      institutionId: "2",
      status: "pending",
      submissionCount: 25,
    },
    {
      label: "Medical Staff - Emergency Unit",
      value: "phase-4",
      institutionId: "3",
      status: "in-progress",
      submissionCount: 12,
    },
  ];

  return allPhases.filter((phase) => phase.institutionId === institutionId);
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissions: SubmissionData[];
}

export function SubmissionAddToPhaseDialog({
  open,
  onOpenChange,
  submissions,
}: Props) {
  const form = useForm<AddToPhaseForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phaseId: "",
    },
  });

  const isBulkOperation = submissions.length > 1;
  const singleSubmission = submissions.length === 1 ? submissions[0] : null;

  // For bulk operations, check if all submissions are from the same institution
  const institutionIds = [...new Set(submissions.map((s) => s.institutionId))];
  const isMixedInstitutions = institutionIds.length > 1;

  // Get available phases based on institution(s)
  const availablePhases = isMixedInstitutions
    ? [] // No phases available for mixed institutions
    : submissions.length > 0 && submissions[0].institutionId
    ? getAvailablePhases(submissions[0].institutionId.toString())
    : [];

  const selectedPhaseId = form.watch("phaseId");
  const selectedPhase = availablePhases.find(
    (p) => p.value === selectedPhaseId
  );

  // Group submissions by institution for display
  const submissionsByInstitution = submissions.reduce((acc, submission) => {
    const key = submission.institutionName || 'Unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(submission);
    return acc;
  }, {} as Record<string, SubmissionData[]>);

  const onSubmit = (values: AddToPhaseForm) => {
    if (submissions.length === 0) return;

    const selectedPhaseData = availablePhases.find(
      (p) => p.value === values.phaseId
    );

    const updatedSubmissions = submissions.map((submission) => ({
      ...submission,
      phaseId: values.phaseId,
      phaseName: selectedPhaseData?.label,
      addedToPhaseAt: new Date().toISOString(),
    }));

    console.log(`Adding ${submissions.length} submission(s) to phase:`, {
      phaseId: values.phaseId,
      phaseName: selectedPhaseData?.label,
      submissionIds: submissions.map((s) => s.id),
      submissionNames: submissions.map((s) => s.personName),
      updatedSubmissions,
    });

    form.reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  if (submissions.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            {isBulkOperation ? "Bulk Add to Phase" : "Add to Phase"}
          </DialogTitle>
          <DialogDescription>
            {isBulkOperation
              ? `Assign ${submissions.length} submissions to a phase for better organization.`
              : "Assign this submission to a phase for better organization."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Submissions Summary */}
          <div className="bg-muted/50 p-3 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-medium text-sm">
                {isBulkOperation
                  ? `Selected Submissions (${submissions.length})`
                  : "Submission Details"}
              </span>
            </div>

            {isBulkOperation ? (
              <div className="space-y-3">
                {/* Summary by institution */}
                {Object.entries(submissionsByInstitution).map(
                  ([institution, subs]) => (
                    <div key={institution} className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        {institution} ({subs.length} submission
                        {subs.length !== 1 ? "s" : ""})
                      </div>
                      <ScrollArea className="max-h-24">
                        <div className="space-y-1">
                          {subs.map((sub, index) => (
                            <div
                              key={sub.id}
                              className="text-xs text-muted-foreground"
                            >
                              {index + 1}. {sub.personName}
                              {sub.category && ` (${sub.category})`}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )
                )}

                {/* Mixed institutions warning */}
                {isMixedInstitutions && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertDescription className="text-amber-800 text-sm">
                      You have selected submissions from multiple institutions.
                      Please select submissions from the same institution to
                      assign them to a phase.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              singleSubmission && (
                <div className="space-y-1">
                  <div className="flex items-start justify-between text-sm gap-2">
                    <span className="text-muted-foreground shrink-0">
                      Person:
                    </span>
                    <span className="font-medium text-right break-words">
                      {singleSubmission.personName}
                    </span>
                  </div>
                  <div className="flex items-start justify-between text-sm gap-2">
                    <span className="text-muted-foreground shrink-0">
                      Institution:
                    </span>
                    <span className="text-xs text-right break-words">
                      {singleSubmission.institutionName}
                    </span>
                  </div>
                  {singleSubmission.category && (
                    <div className="flex items-start justify-between text-sm gap-2">
                      <span className="text-muted-foreground shrink-0">
                        Category:
                      </span>
                      <span className="text-xs text-right break-words">
                        {singleSubmission.category}
                      </span>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* Show alert if no phases available */}
          {availablePhases.length === 0 && !isMixedInstitutions ? (
            <Alert>
              <Search className="h-4 w-4" />
              <AlertDescription>
                No phases are available for this institution. Create a phase
                first before assigning submissions.
              </AlertDescription>
            </Alert>
          ) : !isMixedInstitutions ? (
            <Form {...form}>
              <form
                id="add-to-phase-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="phaseId"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Select Phase</FormLabel>
                      <div className="w-full">
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Choose a phase..."
                          items={availablePhases.map((phase) => ({
                            label:
                              phase.label.length > 35
                                ? `${phase.label.substring(0, 35)}...`
                                : phase.label,
                            value: phase.value,
                          }))}
                        />
                      </div>
                      <FormMessage />

                      {selectedPhase && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <div className="break-words">
                            <strong>Full name:</strong> {selectedPhase.label}
                          </div>
                          <div className="mt-1">
                            {selectedPhase.status} •{" "}
                            {selectedPhase.submissionCount} submissions
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {/* Selected Phase Info Card */}
                {selectedPhase && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg space-y-2">
                    <div className="font-medium text-sm text-blue-900">
                      Selected Phase:
                    </div>
                    <div className="text-sm text-blue-800 break-words">
                      {selectedPhase.label}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          selectedPhase.status === "completed"
                            ? "border-green-300 bg-green-50 text-green-700"
                            : selectedPhase.status === "in-progress"
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : "border-gray-300 bg-gray-50 text-gray-700"
                        }`}
                      >
                        {selectedPhase.status.replace("-", " ")}
                      </Badge>
                      <span className="text-xs text-blue-600">
                        {selectedPhase.submissionCount} submissions
                      </span>
                    </div>
                  </div>
                )}

                {/* Warning for completed phases */}
                {selectedPhase?.status === "completed" && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertDescription className="text-amber-800 text-sm">
                      Note: This phase is marked as completed. You can still add
                      {isBulkOperation
                        ? ` ${submissions.length} submissions`
                        : " this submission"}
                      , but consider if this is the right phase.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </Form>
          ) : null}
        </div>

        <DialogFooter className="gap-y-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            form="add-to-phase-form"
            disabled={availablePhases.length === 0 || isMixedInstitutions}
          >
            <Save className="mr-2 h-4 w-4" />
            {isBulkOperation
              ? `Add ${submissions.length} to Phase`
              : "Add to Phase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
