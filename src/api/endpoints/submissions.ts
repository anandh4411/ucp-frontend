import { apiClient } from '../client/axios';
import type { CreateSubmissionRequest, UpdateSubmissionRequest, GetSubmissionsParams } from '@/types/dto/submission.dto';
import { env } from '@/config/env';

export const submissionsApi = {
  getSubmissions: (params?: GetSubmissionsParams) =>
    apiClient.get<any>(`${env.apiVersion}/submissions`, { params }),

  getSubmissionById: (uuid: string) =>
    apiClient.get<any>(`${env.apiVersion}/submissions/${uuid}`),

  createSubmission: (data: CreateSubmissionRequest) => {
    // Handle file upload
    if (data.imageUrl instanceof File) {
      const formData = new FormData();
      formData.append('institutionId', String(data.institutionId));
      formData.append('personName', data.personName);
      if (data.category) formData.append('category', data.category);
      if (data.idNumber) formData.append('idNumber', data.idNumber);
      if (data.loginCode) formData.append('loginCode', data.loginCode);
      if (data.status) formData.append('status', data.status);
      if (data.phaseId) formData.append('phaseId', String(data.phaseId));
      if (data.importedData) formData.append('importedData', JSON.stringify(data.importedData));
      if (data.formData) formData.append('formData', JSON.stringify(data.formData));
      formData.append('imageUrl', data.imageUrl);
      return apiClient.uploadFile<any>(`${env.apiVersion}/submissions`, formData);
    }
    return apiClient.post<any>(`${env.apiVersion}/submissions`, data);
  },

  updateSubmission: (uuid: string, data: UpdateSubmissionRequest) => {
    // Handle file upload
    if (data.imageUrl instanceof File) {
      const formData = new FormData();
      if (data.institutionId) formData.append('institutionId', String(data.institutionId));
      if (data.personName) formData.append('personName', data.personName);
      if (data.category) formData.append('category', data.category);
      if (data.idNumber) formData.append('idNumber', data.idNumber);
      if (data.loginCode) formData.append('loginCode', data.loginCode);
      if (data.status) formData.append('status', data.status);
      if (data.phaseId) formData.append('phaseId', String(data.phaseId));
      if (data.importedData) formData.append('importedData', JSON.stringify(data.importedData));
      if (data.formData) formData.append('formData', JSON.stringify(data.formData));
      formData.append('imageUrl', data.imageUrl);
      return apiClient.uploadFile<any>(`${env.apiVersion}/submissions/${uuid}`, formData);
    }
    return apiClient.put<any>(`${env.apiVersion}/submissions/${uuid}`, data);
  },

  deleteSubmission: (uuid: string) =>
    apiClient.delete<any>(`${env.apiVersion}/submissions/${uuid}`),
};
