import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileImg } from "@/api";

export const useProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileImg,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
