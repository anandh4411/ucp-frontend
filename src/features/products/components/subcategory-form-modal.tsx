// src/features/products/components/subcategory-form-modal.tsx
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { Save, Edit, FolderTree } from "lucide-react";
import { SubCategory } from "../data/schema";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
});

type SubCategoryForm = z.infer<typeof formSchema>;

interface SubCategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subCategory?: SubCategory;
  mainCategoryId: string;
  onSubmit: (
    data: Omit<SubCategory, "id" | "createdAt" | "updatedAt" | "mainCategoryId">
  ) => void;
}

export const SubCategoryFormModal = ({
  open,
  onOpenChange,
  subCategory,
  mainCategoryId,
  onSubmit,
}: SubCategoryFormModalProps) => {
  const isEdit = !!subCategory;

  const form = useForm<SubCategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subCategory?.name || "",
      description: subCategory?.description || "",
    },
  });

  useEffect(() => {
    if (subCategory) {
      form.reset({
        name: subCategory.name,
        description: subCategory.description,
      });
    } else {
      form.reset({ name: "", description: "" });
    }
  }, [subCategory, form]);

  const handleSubmit = (values: SubCategoryForm) => {
    onSubmit(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              <Edit className="h-5 w-5" />
            ) : (
              <FolderTree className="h-5 w-5" />
            )}
            {isEdit ? "Edit Sub Category" : "Create Sub Category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update sub category details."
              : "Create a new sub category for organizing products."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="subcategory-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Schools (K-12)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this category..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="subcategory-form">
            {isEdit ? (
              <Edit className="mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
