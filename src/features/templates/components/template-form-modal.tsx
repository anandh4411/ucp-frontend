import React, { useEffect, useRef, useState } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectDropdown } from "@/components/select-dropdown";
import { Switch } from "@/components/ui/switch";
import { Save, Edit, Upload, X, Plus, Star } from "lucide-react";
import { useCreateTemplate, useUpdateTemplate } from "@/api/hooks/templates";
import { TemplateData } from "@/types/dto/template.dto";

const formSchema = z.object({
  name: z.string().min(1, { message: "Template name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  imageUrl: z.string().min(1, { message: "Template image is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  features: z
    .array(z.string())
    .min(1, { message: "At least one feature is required." }),
  isPopular: z.boolean(),
  usageCount: z.number(),
});

type TemplateForm = z.infer<typeof formSchema>;

const categoryOptions = [
  { label: "School", value: "school" },
  { label: "Office", value: "office" },
  { label: "Medical", value: "medical" },
  { label: "Generic", value: "generic" },
  { label: "Other", value: "other" },
];

interface TemplateFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: TemplateData;
  mode: "add" | "edit";
}

export const TemplateFormModal = ({
  open,
  onOpenChange,
  template,
  mode,
}: TemplateFormModalProps) => {
  const isEdit = !!template;
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [features, setFeatures] = useState<string[]>([""]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (template?.features && template.features.length > 0) {
      setFeatures(template.features);
    } else {
      setFeatures([""]);
    }
  }, [template]);

  const form = useForm<TemplateForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.name || "",
      description: template?.description || "",
      imageUrl: template?.imageUrl || "",
      category: template?.category || "",
      features: template?.features || [""],
      isPopular: template?.isPopular || false,
      usageCount: template?.usageCount || 0,
    },
  });

  const handleSubmit = async (values: TemplateForm) => {
    try {
      const filteredFeatures = values.features.filter(
        (feature) => feature.trim() !== ""
      );

      const payload = {
        name: values.name,
        description: values.description,
        imageUrl: imageFile || values.imageUrl,
        category: values.category,
        features: filteredFeatures,
        isPopular: values.isPopular,
      };

      if (isEdit && template?.uuid) {
        await updateTemplate.mutateAsync({
          uuid: template.uuid,
          data: payload,
        });
      } else {
        await createTemplate.mutateAsync(payload);
      }

      form.reset();
      setImageFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit template:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      form.setValue("imageUrl", imageUrl);
    }
  };

  const handleRemoveImage = () => {
    form.setValue("imageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currentImageUrl = form.watch("imageUrl");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              <Edit className="h-5 w-5" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {mode === "add" ? "Create Template" : "Edit Template"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update template details and features."
              : "Create a new ID card template with image and features."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="template-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Template Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Classic School ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select category"
                    items={categoryOptions}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the template..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Popular Toggle */}
            <FormField
              control={form.control}
              name="isPopular"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Mark as Popular
                    </FormLabel>
                    <FormDescription className="text-sm text-muted-foreground">
                      Popular templates are highlighted to users
                    </FormDescription>
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

            {/* Features */}
            <div className="space-y-4">
              <FormLabel>Template Features</FormLabel>
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`features.${index}` as const}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="e.g., Student Photo"
                            value={features[index]}
                            onChange={(e) => {
                              const newFeatures = [...features];
                              newFeatures[index] = e.target.value;
                              setFeatures(newFeatures);
                              form.setValue("features", newFeatures);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newFeatures = features.filter(
                          (_, i) => i !== index
                        );
                        setFeatures(newFeatures);
                        form.setValue("features", newFeatures);
                      }}
                      className="px-3"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFeatures([...features, ""])}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Image</FormLabel>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    {currentImageUrl && (
                      <div className="relative">
                        <div className="border rounded-lg p-2 bg-muted/30">
                          <img
                            src={currentImageUrl}
                            alt="Template preview"
                            className="w-full h-32 object-contain rounded"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
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
          <Button type="submit" form="template-form">
            {isEdit ? (
              <Edit className="mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEdit ? "Update Template" : "Create Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
