import {
  createFeedback,
  deleteFeedback,
  getAllFeedback,
  getSingleFeedback,
  udpateFeedback,
} from "@/api";
import { QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFeedbackCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["single-service"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-service-customer"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-region-service"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-order"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-order"],
      });
    },
  });
};

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      id,
    }: {
      payload: Parameters<typeof udpateFeedback>[0];
      id: Parameters<typeof udpateFeedback>[1];
    }) => udpateFeedback(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["single-service"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-service-customer"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-region-service"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-order"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-order"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-feedback"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-feedback"],
      });
    },
  });
};

export const useGetSingleFeedback = (id: string) => {
  return useQuery({
    queryKey: ["single-feedback", id],
    queryFn: () => getSingleFeedback(id),
  });
};

export const useGetAllFeedback = (params: QueryParams) => {
  return useQuery({
    queryKey: ["all-feedback", params],
    queryFn: () => getAllFeedback(params),
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFeedback(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["single-order"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-order"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-feedback"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-feedback"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-service"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-service-customer"],
      });
    },
  });
};
