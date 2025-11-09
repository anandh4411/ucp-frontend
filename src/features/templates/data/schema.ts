import { z } from "zod";

export const templateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Template name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Template image is required"),
  category: z.enum(["school", "office", "medical", "generic", "other"]),
  features: z.array(z.string()),
  isPopular: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  usageCount: z.number().default(0),
});

export type Template = z.infer<typeof templateSchema>;
