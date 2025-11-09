// Templates DTOs
export type TemplateData = {
  id?: number;
  uuid?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  features?: string[];
  isPopular?: boolean;
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTemplateRequest = {
  name: string;
  description: string;
  imageUrl?: File | string;
  category: string;
  features?: string[];
  isPopular?: boolean;
};

export type UpdateTemplateRequest = Partial<CreateTemplateRequest>;

export type GetTemplatesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  isPopular?: boolean;
};
