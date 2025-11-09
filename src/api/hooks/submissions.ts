import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { submissionsApi } from '@/api/endpoints/submissions';
import { queryKeys } from '@/api/query-keys';
import { toast } from '@/lib/toast';
import type { CreateSubmissionRequest, UpdateSubmissionRequest, GetSubmissionsParams } from '@/types/dto/submission.dto';

export const useSubmissions = (params?: GetSubmissionsParams) => {
  return useQuery({
    queryKey: queryKeys.submissions.list(params),
    queryFn: () => submissionsApi.getSubmissions(params),
    placeholderData: keepPreviousData,
  });
};

export const useSubmission = (uuid: string) => {
  return useQuery({
    queryKey: queryKeys.submissions.detail(uuid),
    queryFn: () => submissionsApi.getSubmissionById(uuid),
    enabled: !!uuid,
  });
};

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubmissionRequest) => submissionsApi.createSubmission(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions.lists() });
      toast.success('Success', response.message || 'Submission created');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to create submission');
    },
  });
};

export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateSubmissionRequest }) =>
      submissionsApi.updateSubmission(uuid, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions.detail(variables.uuid) });
      toast.success('Success', response.message || 'Submission updated');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to update submission');
    },
  });
};

export const useDeleteSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => submissionsApi.deleteSubmission(uuid),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions.lists() });
      toast.success('Success', response.message || 'Submission deleted');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to delete submission');
    },
  });
};
