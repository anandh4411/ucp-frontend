// src/features/submissions/data/schema.ts
import { z } from "zod";

export const submissionSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  institutionName: z.string(),
  personName: z.string(),
  category: z.string().optional(), // class/department
  idNumber: z.string().optional(), // roll no/employee no
  loginCode: z.string(),
  status: z.enum(["pending", "submitted", "expired"]),
  submittedAt: z.string().optional(),
  createdAt: z.string(),
  // Phase information
  phaseId: z.string().optional(),
  phaseName: z.string().optional(),
  addedToPhaseAt: z.string().optional(),
  // Additional fields from imported data
  importedData: z.record(z.any()).optional(),
  // Form submission data
  formData: z.record(z.any()).optional(),
  imageUrl: z.string().optional(),
});

export const submissionListSchema = z.array(submissionSchema);

export type Submission = z.infer<typeof submissionSchema>;
export type SubmissionList = z.infer<typeof submissionListSchema>;
