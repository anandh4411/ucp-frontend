// src/features/dashboard/data/schema.ts
import { z } from "zod";

export const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  category: z.enum(["school", "office", "medical", "generic"]),
  features: z.array(z.string()),
  isPopular: z.boolean().default(false),
});

export const institutionProgressSchema = z.object({
  institutionId: z.string(),
  institutionName: z.string(),
  selectedTemplateId: z.string().nullable(),
  selectedTemplate: templateSchema.nullable(),
  totalPhases: z.number(),
  completedPhases: z.number(),
  inProgressPhases: z.number(),
  pendingPhases: z.number(),
  totalSubmissions: z.number(),
  completedSubmissions: z.number(),
  pendingSubmissions: z.number(),
  completionPercentage: z.number(),
  lastActivity: z.string(),
});

export const phaseCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  // Updated to use production workflow statuses
  status: z.enum([
    "file-processing",
    "design-completed",
    "printing-ongoing",
    "lanyard-attachment",
    "packaging-process",
    "on-transit",
    "delivered",
  ]),
  submissionCount: z.number(),
  targetCount: z.number().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  createdAt: z.string(),
});

export const templateListSchema = z.array(templateSchema);
export const phaseListSchema = z.array(phaseCardSchema);

export type Template = z.infer<typeof templateSchema>;
export type InstitutionProgress = z.infer<typeof institutionProgressSchema>;
export type PhaseCard = z.infer<typeof phaseCardSchema>;
export type TemplateList = z.infer<typeof templateListSchema>;
export type PhaseList = z.infer<typeof phaseListSchema>;
