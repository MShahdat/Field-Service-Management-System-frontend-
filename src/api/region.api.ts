import apiClient from "@/lib/apiClient";

export const getRegions = () => {
  return apiClient("/region");
};
