// src/features/submissions/components/submission-manual-add-dialog.tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Save } from "lucide-react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectDropdown } from "@/components/select-dropdown";
import { useCreateSubmission } from "@/api/hooks/submissions";

const formSchema = z.object({
  institutionId: z.string().min(1, { message: "Institution is required." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  uniqueId: z.string().min(1, { message: "Unique ID is required." }),
});

type ManualAddForm = z.infer<typeof formSchema>;

// Mock institutions - in real app, fetch from API
const institutions = [
  { label: "Springfield Elementary School", value: "1" },
  { label: "TechCorp Solutions", value: "2" },
  { label: "Community Health Center", value: "3" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmissionManualAddDialog({ open, onOpenChange }: Props) {
  const createSubmission = useCreateSubmission();

  const form = useForm<ManualAddForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institutionId: "",
      firstName: "",
      lastName: "",
      uniqueId: "",
    },
  });

  const onSubmit = async (values: ManualAddForm) => {
    try {
      const verificationCode = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

      const payload = {
        institutionId: parseInt(values.institutionId),
        personName: `${values.firstName} ${values.lastName}`,
        idNumber: values.uniqueId,
        loginCode: verificationCode,
        status: "pending",
      };

      await createSubmission.mutateAsync(payload);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create submission:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Person Manually
          </DialogTitle>
          <DialogDescription>
            Add a new person and generate a login code for ID card submission.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="manual-add-form"
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
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="uniqueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unique ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. STU001, EMP123, or Roll Number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="manual-add-form">
            <Save className="mr-2 h-4 w-4" />
            Add Person
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
