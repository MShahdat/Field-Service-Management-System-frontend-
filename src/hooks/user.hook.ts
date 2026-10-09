import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, updateProfileImg, updateStatus } from "@/api";
import { QueryParams } from "@/types";

export const useProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileImg,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useGetAllUsers = (params: QueryParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getAllUsers(params),
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      id,
    }: {
      payload: Parameters<typeof updateStatus>[0];
      id: Parameters<typeof updateStatus>[1];
    }) => updateStatus(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};
