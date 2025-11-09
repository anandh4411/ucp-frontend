import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { institutionsApi } from '@/api/endpoints/institutions';
import { queryKeys } from '@/api/query-keys';
import { toast } from '@/lib/toast';
import type { CreateInstitutionRequest, UpdateInstitutionRequest, GetInstitutionsParams } from '@/types/dto/institution.dto';

export const useInstitutions = (params?: GetInstitutionsParams) => {
  return useQuery({
    queryKey: queryKeys.institutions.list(params),
    queryFn: () => institutionsApi.getInstitutions(params),
    placeholderData: keepPreviousData,
  });
};

export const useInstitution = (uuid: string) => {
  return useQuery({
    queryKey: queryKeys.institutions.detail(uuid),
    queryFn: () => institutionsApi.getInstitutionById(uuid),
    enabled: !!uuid,
  });
};

export const useCreateInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInstitutionRequest) => institutionsApi.createInstitution(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.institutions.lists() });
      toast.success('Success', response.message || 'Institution created');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to create institution');
    },
  });
};

export const useUpdateInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateInstitutionRequest }) =>
      institutionsApi.updateInstitution(uuid, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.institutions.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.institutions.detail(variables.uuid) });
      toast.success('Success', response.message || 'Institution updated');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to update institution');
    },
  });
};

export const useDeleteInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => institutionsApi.deleteInstitution(uuid),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.institutions.lists() });
      toast.success('Success', response.message || 'Institution deleted');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to delete institution');
    },
  });
};
