// src/features/products/data/schema.ts
import { z } from "zod";

// Main categories are fixed
export const mainCategories = [
  { id: "id-cards", name: "ID Cards", icon: "building" },
  { id: "personalised-gifts", name: "Personalised Gifts", icon: "gift" },
  { id: "mementos-trophies", name: "Mementos & Trophies", icon: "trophy" },
  { id: "office-stamps", name: "Office Stamps", icon: "stamp" },
] as const;

export type MainCategoryId = (typeof mainCategories)[number]["id"];

// Sub category schema
export const subCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  mainCategoryId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SubCategory = z.infer<typeof subCategorySchema>;

// Updated product schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  image: z.string().optional(),
  mainCategoryId: z.string(),
  subCategoryId: z.string(),
  isPopular: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof productSchema>;
