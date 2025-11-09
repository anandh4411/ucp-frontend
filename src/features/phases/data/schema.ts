// src/features/phases/data/schema.ts
import { z } from "zod";

export const phaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  institutionId: z.string(),
  institutionName: z.string(),
  status: z.enum([
    "file-processing",
    "design-completed",
    "printing-ongoing",
    "lanyard-attachment",
    "packaging-process",
    "on-transit",
    "delivered",
  ]),
  submissionCount: z.number().default(0),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const phaseListSchema = z.array(phaseSchema);

export type Phase = z.infer<typeof phaseSchema>;
export type PhaseList = z.infer<typeof phaseListSchema>;

// For submission-to-phase relationship
export const submissionPhaseSchema = z.object({
  submissionId: z.string(),
  phaseId: z.string(),
  addedAt: z.string(),
});

export type SubmissionPhase = z.infer<typeof submissionPhaseSchema>;
