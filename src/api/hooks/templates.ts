import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { templatesApi } from '@/api/endpoints/templates';
import { queryKeys } from '@/api/query-keys';
import { toast } from '@/lib/toast';
import type { CreateTemplateRequest, UpdateTemplateRequest, GetTemplatesParams } from '@/types/dto/template.dto';

export const useTemplates = (params?: GetTemplatesParams) => {
  return useQuery({
    queryKey: queryKeys.templates.list(params),
    queryFn: () => templatesApi.getTemplates(params),
    placeholderData: keepPreviousData,
  });
};

export const useTemplate = (uuid: string) => {
  return useQuery({
    queryKey: queryKeys.templates.detail(uuid),
    queryFn: () => templatesApi.getTemplateById(uuid),
    enabled: !!uuid,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTemplateRequest) => templatesApi.createTemplate(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.lists() });
      toast.success('Success', response.message || 'Template created');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to create template');
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateTemplateRequest }) =>
      templatesApi.updateTemplate(uuid, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.detail(variables.uuid) });
      toast.success('Success', response.message || 'Template updated');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to update template');
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => templatesApi.deleteTemplate(uuid),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.lists() });
      toast.success('Success', response.message || 'Template deleted');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to delete template');
    },
  });
};
