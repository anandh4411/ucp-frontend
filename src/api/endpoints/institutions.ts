import { apiClient } from '../client/axios';
import type { CreateInstitutionRequest, UpdateInstitutionRequest, GetInstitutionsParams, InstitutionData } from '@/types/dto/institution.dto';
import { env } from '@/config/env';

export const institutionsApi = {
  getInstitutions: (params?: GetInstitutionsParams) =>
    apiClient.get<any>(`${env.apiVersion}/institutions`, { params }),

  getInstitutionById: (uuid: string) =>
    apiClient.get<any>(`${env.apiVersion}/institutions/${uuid}`),

  createInstitution: (data: CreateInstitutionRequest) =>
    apiClient.post<any>(`${env.apiVersion}/institutions`, data),

  updateInstitution: (uuid: string, data: UpdateInstitutionRequest) =>
    apiClient.put<any>(`${env.apiVersion}/institutions/${uuid}`, data),

  deleteInstitution: (uuid: string) =>
    apiClient.delete<any>(`${env.apiVersion}/institutions/${uuid}`),
};
