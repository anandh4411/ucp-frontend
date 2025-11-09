import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { phasesApi } from '@/api/endpoints/phases';
import { queryKeys } from '@/api/query-keys';
import { toast } from '@/lib/toast';
import type { CreatePhaseRequest, UpdatePhaseRequest, GetPhasesParams } from '@/types/dto/phase.dto';

export const usePhases = (params?: GetPhasesParams) => {
  return useQuery({
    queryKey: queryKeys.phases.list(params),
    queryFn: () => phasesApi.getPhases(params),
    placeholderData: keepPreviousData,
  });
};

export const usePhase = (uuid: string) => {
  return useQuery({
    queryKey: queryKeys.phases.detail(uuid),
    queryFn: () => phasesApi.getPhaseById(uuid),
    enabled: !!uuid,
  });
};

export const useCreatePhase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePhaseRequest) => phasesApi.createPhase(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.phases.lists() });
      toast.success('Success', response.message || 'Phase created');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to create phase');
    },
  });
};

export const useUpdatePhase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdatePhaseRequest }) =>
      phasesApi.updatePhase(uuid, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.phases.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.phases.detail(variables.uuid) });
      toast.success('Success', response.message || 'Phase updated');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to update phase');
    },
  });
};

export const useDeletePhase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => phasesApi.deletePhase(uuid),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.phases.lists() });
      toast.success('Success', response.message || 'Phase deleted');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to delete phase');
    },
  });
};
