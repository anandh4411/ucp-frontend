import { apiClient } from '../client/axios';
import type { CreateFormRequest, UpdateFormRequest, GetFormsParams } from '@/types/dto/form.dto';
import { env } from '@/config/env';

export const formsApi = {
  getForms: (params?: GetFormsParams) =>
    apiClient.get<any>(`${env.apiVersion}/forms`, { params }),

  getFormById: (uuid: string) =>
    apiClient.get<any>(`${env.apiVersion}/forms/${uuid}`),

  createForm: (data: CreateFormRequest) =>
    apiClient.post<any>(`${env.apiVersion}/forms`, data),

  updateForm: (uuid: string, data: UpdateFormRequest) =>
    apiClient.put<any>(`${env.apiVersion}/forms/${uuid}`, data),

  deleteForm: (uuid: string) =>
    apiClient.delete<any>(`${env.apiVersion}/forms/${uuid}`),
};
