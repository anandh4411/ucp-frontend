// src/features/institutions/components/institution-form-modal.tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Plus, Save } from "lucide-react";
import { useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { institutionTypes } from "../data/data";
import {
  useCreateInstitution,
  useUpdateInstitution,
} from "@/api/hooks/institutions";
import { InstitutionData } from "@/types/dto/institution.dto";

const formSchema = z.object({
  name: z.string().min(1, { message: "Institution name is required." }),
  type: z.string().min(1, { message: "Institution type is required." }),
  address: z.string().optional(),
  contactPerson: z.string().min(1, { message: "Contact person is required." }),
  contactPhone: z
    .string()
    .min(1, { message: "Contact phone is required." })
    // Accepts digits, spaces, +, -, and parentheses
    .regex(/^[0-9+\-\s()]{7,20}$/, {
      message: "Enter a valid phone number.",
    }),
  contactEmail: z
    .string()
    .min(1, { message: "Contact email is required." })
    .email({ message: "Contact email is invalid." }),
  status: z.boolean(),
});

type InstitutionForm = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  institution?: InstitutionData | null;
  mode: "add" | "edit";
}

export function InstitutionFormModal({
  open,
  onOpenChange,
  institution,
  mode,
}: Props) {
  const createInstitution = useCreateInstitution();
  const updateInstitution = useUpdateInstitution();

  const form = useForm<InstitutionForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: institution?.name || "",
      type: institution?.type || "",
      address: institution?.address || "",
      contactPerson: institution?.contactPerson || "",
      contactPhone: institution?.contactPhone || "",
      contactEmail: institution?.contactEmail || "",
      status: institution?.isAccessActive ?? true,
    },
  });

  // Reset form when institution changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: institution?.name || "",
        type: institution?.type || "",
        address: institution?.address || "",
        contactPerson: institution?.contactPerson || "",
        contactPhone: institution?.contactPhone || "",
        contactEmail: institution?.contactEmail || "",
        status: institution?.isAccessActive ?? true,
      });
    }
  }, [institution, open, form]);

  const onSubmit = async (values: InstitutionForm) => {
    try {
      const payload = {
        name: values.name,
        type: values.type,
        address: values.address,
        contactPerson: values.contactPerson,
        contactPhone: values.contactPhone,
        contactEmail: values.contactEmail,
        isAccessActive: values.status,
      };

      if (mode === "add") {
        await createInstitution.mutateAsync(payload);
      } else if (mode === "edit" && institution?.uuid) {
        await updateInstitution.mutateAsync({
          uuid: institution.uuid,
          data: payload,
        });
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      // Error is handled in the mutation hooks with toast
      console.error("Failed to submit institution:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const isSubmitting =
    createInstitution.isPending || updateInstitution.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {mode === "add" ? "Add Institution" : "Edit Institution"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new institution to manage ID card creation for its members."
              : "Update institution details and settings."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="institution-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-h-[60vh] overflow-y-auto p-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Springfield Elementary School"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Institution Type</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select institution type"
                    items={institutionTypes.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Enter institution address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. +1-555-0123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g. contact@institution.edu"
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value
                        ? "Institution is active"
                        : "Institution is inactive"}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="institution-form" disabled={isSubmitting}>
            {mode === "add" ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {isSubmitting ? "Adding..." : "Add Institution"}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
