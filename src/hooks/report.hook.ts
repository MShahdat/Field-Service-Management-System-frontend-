import {
  createReport,
  deleteReport,
  getAllReports,
  getMyReports,
  updateReport,
} from "@/api";
import { QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReport,
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

export const useGetMyReports = (params: QueryParams) => {
  return useQuery({
    queryKey: ["my-reports"],
    queryFn: () => getMyReports(params),
  });
};

export const useGetAllReports = (params: QueryParams) => {
  return useQuery({
    queryKey: ["all-reports"],
    queryFn: () => getAllReports(params),
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      id,
    }: {
      payload: Parameters<typeof updateReport>[0];
      id: Parameters<typeof updateReport>[1];
    }) => updateReport(payload, id),
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
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: Parameters<typeof deleteReport>[0] }) =>
      deleteReport(id),
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
    },
  });
};
