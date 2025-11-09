import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { formsApi } from '@/api/endpoints/forms';
import { queryKeys } from '@/api/query-keys';
import { toast } from '@/lib/toast';
import type { CreateFormRequest, UpdateFormRequest, GetFormsParams } from '@/types/dto/form.dto';

export const useForms = (params?: GetFormsParams) => {
  return useQuery({
    queryKey: queryKeys.forms.list(params),
    queryFn: () => formsApi.getForms(params),
    placeholderData: keepPreviousData,
  });
};

export const useForm = (uuid: string) => {
  return useQuery({
    queryKey: queryKeys.forms.detail(uuid),
    queryFn: () => formsApi.getFormById(uuid),
    enabled: !!uuid,
  });
};

export const useCreateForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFormRequest) => formsApi.createForm(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.lists() });
      toast.success('Success', response.message || 'Form created');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to create form');
    },
  });
};

export const useUpdateForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateFormRequest }) =>
      formsApi.updateForm(uuid, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.detail(variables.uuid) });
      toast.success('Success', response.message || 'Form updated');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to update form');
    },
  });
};

export const useDeleteForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => formsApi.deleteForm(uuid),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.lists() });
      toast.success('Success', response.message || 'Form deleted');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to delete form');
    },
  });
};
