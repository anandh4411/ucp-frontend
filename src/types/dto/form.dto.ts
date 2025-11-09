// Forms DTOs
export type FormData = {
  id?: number;
  uuid?: string;
  institutionId?: number;
  institutionName?: string;
  name?: string;
  description?: string;
  fields?: any; // JSON field
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateFormRequest = {
  name: string;
  description?: string;
  institutionId?: number;
  fields?: any;
  status?: string;
};

export type UpdateFormRequest = Partial<CreateFormRequest>;

export type GetFormsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  institutionId?: number;
  status?: string;
};
