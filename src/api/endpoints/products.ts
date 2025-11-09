import { apiClient } from '../client/axios';
import type { CreateProductRequest, UpdateProductRequest, GetProductsParams } from '@/types/dto/product.dto';
import { env } from '@/config/env';

export const productsApi = {
  getProducts: (params?: GetProductsParams) =>
    apiClient.get<any>(`${env.apiVersion}/products`, { params }),

  getProductById: (uuid: string) =>
    apiClient.get<any>(`${env.apiVersion}/products/${uuid}`),

  createProduct: (data: CreateProductRequest) => {
    // Handle file upload
    if (data.image instanceof File) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('price', data.price);
      formData.append('mainCategoryId', data.mainCategoryId);
      formData.append('subCategoryId', data.subCategoryId);
      formData.append('isPopular', String(data.isPopular || false));
      formData.append('image', data.image);
      return apiClient.uploadFile<any>(`${env.apiVersion}/products`, formData);
    }
    return apiClient.post<any>(`${env.apiVersion}/products`, data);
  },

  updateProduct: (uuid: string, data: UpdateProductRequest) => {
    // Handle file upload
    if (data.image instanceof File) {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.price) formData.append('price', data.price);
      if (data.mainCategoryId) formData.append('mainCategoryId', data.mainCategoryId);
      if (data.subCategoryId) formData.append('subCategoryId', data.subCategoryId);
      if (data.isPopular !== undefined) formData.append('isPopular', String(data.isPopular));
      formData.append('image', data.image);
      return apiClient.uploadFile<any>(`${env.apiVersion}/products/${uuid}`, formData);
    }
    return apiClient.put<any>(`${env.apiVersion}/products/${uuid}`, data);
  },

  deleteProduct: (uuid: string) =>
    apiClient.delete<any>(`${env.apiVersion}/products/${uuid}`),
};
