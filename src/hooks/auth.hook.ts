import {
  getFacebookAuthUrl,
  getGoogleAuthUrl,
  getMe,
  logout,
  userEmailVerify,
  userLogin,
  userRegister,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({
    mutationFn: userRegister,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useOAuthLogin = () => {
  const startOAuth = (p: "google" | "facebook") => {
    window.location.href =
      p === "google" ? getGoogleAuthUrl() : getFacebookAuthUrl();
  };
  return { startOAuth };
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    // enabled: typeof window !== "undefined",
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};

export const useEmailVerify = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userEmailVerify,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};
