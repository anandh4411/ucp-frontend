import { apiClient } from '../client/axios';
import type { CreatePhaseRequest, UpdatePhaseRequest, GetPhasesParams } from '@/types/dto/phase.dto';
import { env } from '@/config/env';

export const phasesApi = {
  getPhases: (params?: GetPhasesParams) =>
    apiClient.get<any>(`${env.apiVersion}/phases`, { params }),

  getPhaseById: (uuid: string) =>
    apiClient.get<any>(`${env.apiVersion}/phases/${uuid}`),

  createPhase: (data: CreatePhaseRequest) =>
    apiClient.post<any>(`${env.apiVersion}/phases`, data),

  updatePhase: (uuid: string, data: UpdatePhaseRequest) =>
    apiClient.put<any>(`${env.apiVersion}/phases/${uuid}`, data),

  deletePhase: (uuid: string) =>
    apiClient.delete<any>(`${env.apiVersion}/phases/${uuid}`),
};
