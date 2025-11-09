// src/features/forms/components/form-form-modal.tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Plus, Save } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { SelectDropdown } from "@/components/select-dropdown";
import { institutions } from "../data/data";
import { useEffect } from "react";
import { useCreateForm, useUpdateForm } from "@/api/hooks/forms";
import { FormData as FormDataType } from "@/types/dto/form.dto";

const formSchema = z.object({
  name: z.string().min(1, { message: "Form name is required." }),
  institutionId: z.string().min(1, { message: "Institution is required." }),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form?: FormDataType;
  mode: "add" | "edit";
}

export function FormFormModal({ open, onOpenChange, form: formData, mode }: Props) {
  const createForm = useCreateForm();
  const updateForm = useUpdateForm();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      institutionId: "",
      description: "",
    },
  });

  useEffect(() => {
    if (formData && mode === "edit") {
      form.reset({
        name: formData.name || "",
        institutionId: formData.institutionId?.toString() || "",
        description: formData.description || "",
      });
    } else {
      form.reset({
        name: "",
        institutionId: "",
        description: "",
      });
    }
  }, [formData, mode, form, open]);

  const onSubmit = async (values: FormData) => {
    try {
      const payload = {
        name: values.name,
        institutionId: parseInt(values.institutionId),
        description: values.description,
      };

      if (mode === "add") {
        await createForm.mutateAsync(payload);
      } else if (mode === "edit" && formData?.uuid) {
        await updateForm.mutateAsync({
          uuid: formData.uuid,
          data: payload,
        });
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit form:", error);
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
            <FileText className="h-5 w-5" />
            {mode === "add" ? "Create New Form" : "Edit Form"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new form for collecting ID card information."
              : "Update form details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="form-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Form Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Student ID Card Form" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Brief description"
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
          <Button
            type="submit"
            form="form-form"
            disabled={createForm.isPending || updateForm.isPending}
          >
            {mode === "add" ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {createForm.isPending ? "Creating..." : "Create Form"}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {updateForm.isPending ? "Saving..." : "Save Changes"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
