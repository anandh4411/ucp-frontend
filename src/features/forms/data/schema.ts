import { z } from "zod";

export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum([
    "text",
    "email",
    "phone",
    "select",
    "date",
    "file",
    "textarea",
    "number",
  ]),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // For select fields
  validation: z
    .object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      pattern: z.string().optional(),
    })
    .optional(),
  defaultValue: z.string().optional(),
  helpText: z.string().optional(),
  order: z.number(),
});

export const formSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  institutionName: z.string(),
  name: z.string(),
  description: z.string().optional(),
  fields: z.array(formFieldSchema),
  status: z.enum(["draft", "published"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
});

export const formListSchema = z.array(formSchema);

export type FormField = z.infer<typeof formFieldSchema>;
export type Form = z.infer<typeof formSchema>;
export type FormList = z.infer<typeof formListSchema>;

// Field types for form builder
export interface FieldType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultProps: Partial<FormField>;
}
