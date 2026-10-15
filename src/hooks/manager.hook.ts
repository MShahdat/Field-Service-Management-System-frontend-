import {
  getManagerList,
  managerApply,
  managerEmailVerify,
  managerResendOtp,
  managerReview,
} from "@/api";
import { QueryParams } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useManagerApply = () => {
  return useMutation({
    mutationFn: managerApply,
  });
};

export const useMangerEmailVerify = () => {
  return useMutation({
    mutationFn: managerEmailVerify,
  });
};

export const useManagerResendOtp = () => {
  return useMutation({
    mutationFn: managerResendOtp,
  });
};

export const useSuspenseGetAllManagers = (params?: QueryParams) => {
  return useSuspenseQuery({
    queryKey: ["all-managers", params],
    queryFn: () => getManagerList(params),
  });
};

export const useManagerReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: managerReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-managers"],
      });
    },
  });
};
