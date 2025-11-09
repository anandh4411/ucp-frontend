// Submissions DTOs
export type SubmissionData = {
  id?: number;
  uuid?: string;
  institutionId?: number;
  institutionName?: string;
  personName?: string;
  category?: string;
  idNumber?: string;
  loginCode?: string;
  status?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  phaseId?: number;
  phaseName?: string;
  addedToPhaseAt?: string;
  importedData?: any;
  formData?: any;
  imageUrl?: string;
};

export type CreateSubmissionRequest = {
  institutionId: number;
  personName: string;
  category?: string;
  idNumber?: string;
  loginCode?: string;
  status?: string;
  phaseId?: number;
  importedData?: any;
  formData?: any;
  imageUrl?: File | string;
};

export type UpdateSubmissionRequest = Partial<CreateSubmissionRequest>;

export type GetSubmissionsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  institutionId?: number;
  phaseId?: number;
  status?: string;
};
