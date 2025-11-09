import { z } from "zod";

// User roles
export type UserRole = "adjt" | "it_jco" | "user";

// User schema
export const UserSchema = z.object({
  id: z.string(),
  uuid: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["adjt", "it_jco", "user"]),
  rank: z.string().optional(), // Military rank
  serviceNumber: z.string().optional(), // Army service number
  unit: z.string().optional(), // Unit name
  avatar: z.string().optional(),
  createdAt: z.string(),
  isActive: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

// Sign up request
export const SignUpRequestSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    rank: z.string().min(1, "Rank is required"),
    serviceNumber: z.string().min(1, "Service number is required"),
    unit: z.string().min(1, "Unit is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
