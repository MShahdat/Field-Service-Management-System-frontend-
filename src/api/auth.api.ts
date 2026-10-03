import apiClient from "@/lib/apiClient";

export const userRegister = (payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  return apiClient("/auth/register", {
    method: "POST",
    body: payload,
  });
};

export const userLogin = (payload: { email: string; password: string }) => {
  return apiClient("/auth/login", {
    method: "POST",
    body: payload,
  });
};

export const getGoogleAuthUrl = () => {
  return `${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/google`;
};

export const getFacebookAuthUrl = () => {
  return `${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/facebook`;
};

export const getMe = () => {
  return apiClient("/auth/me");
};

export const logout = () => {
  return apiClient("/auth/logout", {
    method: "POST",
  });
};

export const userEmailVerify = (payload: { email: string; otp: string }) => {
  return apiClient("/auth/email-verify", {
    method: "POST",
    body: payload,
  });
};
