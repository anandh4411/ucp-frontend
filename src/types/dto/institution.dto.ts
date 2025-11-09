import { z } from 'zod';

// Institution data
export type InstitutionData = {
  id?: number;
  uuid?: string;
  name?: string;
  institutionCode?: string;
  type?: string;
  address?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  accessToken?: string;
  accessTokenExpiresAt?: string;
  accessTokenCreatedAt?: string;
  lastLoginAt?: string;
  activeSessions?: number;
  maxSessions?: number;
  isAccessActive?: boolean;
};

// Request types
export type CreateInstitutionRequest = {
  name: string;
  type: string;
  address?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  isAccessActive?: boolean;
};

export type UpdateInstitutionRequest = Partial<CreateInstitutionRequest>;

export type GetInstitutionsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
