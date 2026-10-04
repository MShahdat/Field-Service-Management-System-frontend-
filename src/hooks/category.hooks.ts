import {
  createCategory,
  deactiveCategory,
  getAllCategories,
  updateCategory,
} from "@/api";
import { QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllCategories = (params?: QueryParams) => {
  return useQuery({
    queryKey: ["all-categories", params],
    queryFn: () => getAllCategories(params),
  });
};

export const useCategoryCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-categories"],
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      id,
    }: {
      payload: Parameters<typeof updateCategory>[0];
      id: Parameters<typeof updateCategory>[1];
    }) => updateCategory(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-categories"],
      });
    },
  });
};

export const useDeactiveCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactiveCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-categories"],
      });
    },
  });
};
