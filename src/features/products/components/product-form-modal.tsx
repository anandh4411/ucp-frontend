// src/features/products/components/product-form-modal.tsx
import { useEffect, useState } from "react";
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
import { Save, Edit, Star, Upload, X, Image as ImageIcon } from "lucide-react";
import { useCreateProduct, useUpdateProduct } from "@/api/hooks/products";
import { ProductData } from "@/types/dto/product.dto";

const formSchema = z.object({
  name: z.string().min(1, { message: "Product name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  price: z.string().min(1, { message: "Price is required." }),
  image: z.string().optional(),
  subCategoryId: z.string().min(1, { message: "Sub category is required." }),
  isPopular: z.boolean(),
});

type ProductForm = z.infer<typeof formSchema>;

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductData;
  subCategories: Array<{ id: string; name: string }>;
  mainCategoryId: string;
}

export const ProductFormModal = ({
  open,
  onOpenChange,
  product,
  subCategories,
  mainCategoryId,
}: ProductFormModalProps) => {
  const isEdit = !!product;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    product?.image
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<ProductForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      image: product?.image || "",
      subCategoryId: product?.subCategoryId || "",
      isPopular: product?.isPopular || false,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image || "",
        subCategoryId: product.subCategoryId,
        isPopular: product.isPopular,
      });
      setImagePreview(product.image);
      setImageFile(null);
    } else {
      form.reset({
        name: "",
        description: "",
        price: "",
        image: "",
        subCategoryId: "",
        isPopular: false,
      });
      setImagePreview(undefined);
      setImageFile(null);
    }
  }, [product, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue("image", result); // Store base64 for now
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(undefined);
    form.setValue("image", "");
  };

  const handleSubmit = async (values: ProductForm) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        mainCategoryId: mainCategoryId,
        subCategoryId: values.subCategoryId,
        isPopular: values.isPopular,
        image: imageFile || values.image,
      };

      if (isEdit && product?.uuid) {
        await updateProduct.mutateAsync({
          uuid: product.uuid,
          data: payload,
        });
      } else {
        await createProduct.mutateAsync(payload);
      }

      form.reset();
      setImagePreview(undefined);
      setImageFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit product:", error);
    }
  };

  const subCategoryOptions = subCategories.map((sc) => ({
    label: sc.name,
    value: sc.id,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              <Edit className="h-5 w-5" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {isEdit ? "Edit Product" : "Create Product"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update product details."
              : "Create a new product with details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="product-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {/* Upload Area */}
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center gap-2 cursor-pointer"
                          >
                            <div className="p-3 rounded-full bg-primary/10">
                              <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                Click to upload image
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, WEBP up to 5MB
                              </p>
                            </div>
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                      ) : (
                        // Preview Area
                        <div className="relative">
                          <div className="h-48 rounded-lg overflow-hidden bg-muted border">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a high-quality product image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., School Starter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sub Category */}
            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Category</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select sub category"
                    items={subCategoryOptions}
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
                      placeholder="Brief description..."
                      className="min-h-[70px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ₹999/month" {...field} />
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

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="product-form">
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
