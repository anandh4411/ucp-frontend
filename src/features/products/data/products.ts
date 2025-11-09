// src/features/products/data/products.ts
import { Product, SubCategory } from "./schema";

export const mockSubCategories: SubCategory[] = [
  {
    id: "sc-1",
    name: "Schools (K-12)",
    description: "Primary and secondary educational institutions",
    mainCategoryId: "id-cards",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sc-2",
    name: "Colleges & Universities",
    description: "Higher education institutions",
    mainCategoryId: "id-cards",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sc-3",
    name: "Photo Gifts",
    description: "Personalized photo products",
    mainCategoryId: "personalised-gifts",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "School Starter",
    description: "Perfect for small schools and academies",
    price: "₹999/month",
    image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400",
    mainCategoryId: "id-cards",
    subCategoryId: "sc-1",
    isPopular: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "School Professional",
    description: "Growing schools with advanced needs",
    price: "₹2,499/month",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    mainCategoryId: "id-cards",
    subCategoryId: "sc-1",
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Custom Photo Frames",
    description: "Personalized frames with custom text",
    price: "₹299/piece",
    mainCategoryId: "personalised-gifts",
    subCategoryId: "sc-3",
    isPopular: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
