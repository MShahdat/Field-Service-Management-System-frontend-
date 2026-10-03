import { managerApply, managerEmailVerify } from "@/api";
import { useMutation } from "@tanstack/react-query";

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
