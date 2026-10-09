import {
  createAttatchment,
  deleteAttatchemet,
  getAttatchment,
  updateAttatchment,
} from "@/api";
import { QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateAttatchement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAttatchment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-reports"],
      });
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

export const useGetAttatchments = (params: QueryParams) => {
  return useQuery({
    queryKey: ["all-attatchemnts"],
    queryFn: () => getAttatchment(params),
  });
};

export const useUpdateAttatchment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      id,
    }: {
      payload: Parameters<typeof updateAttatchment>[0];
      id: Parameters<typeof updateAttatchment>[1];
    }) => updateAttatchment(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-reports"],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["all-attatchments"],
      });
    },
  });
};

export const useDeleteAttatchemnt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: Parameters<typeof deleteAttatchemet>[0] }) =>
      deleteAttatchemet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-reports"],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["all-attatchments"],
      });
    },
  });
};
