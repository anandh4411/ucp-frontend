// Products DTOs
export type ProductData = {
  id?: number;
  uuid?: string;
  name?: string;
  description?: string;
  price?: string;
  image?: string;
  mainCategoryId?: string;
  subCategoryId?: string;
  isPopular?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProductRequest = {
  name: string;
  description?: string;
  price: string;
  image?: File | string;
  mainCategoryId: string;
  subCategoryId: string;
  isPopular?: boolean;
};

export type UpdateProductRequest = Partial<CreateProductRequest>;

export type GetProductsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  mainCategoryId?: string;
  subCategoryId?: string;
  isPopular?: boolean;
};
