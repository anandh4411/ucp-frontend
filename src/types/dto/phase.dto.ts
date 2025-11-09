// Phases DTOs
export type PhaseData = {
  id?: number;
  uuid?: string;
  name?: string;
  description?: string;
  institutionId?: number;
  institutionName?: string;
  status?: string;
  submissionCount?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePhaseRequest = {
  name: string;
  description?: string;
  institutionId?: number;
  status?: string;
  startedAt?: string;
  completedAt?: string;
};

export type UpdatePhaseRequest = Partial<CreatePhaseRequest>;

export type GetPhasesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  institutionId?: number;
  status?: string;
};
