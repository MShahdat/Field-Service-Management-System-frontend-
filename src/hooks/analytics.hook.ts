import {
  getAdminStats,
  getCustomerStats,
  getManagerStats,
  getPublicStats,
  getTechnicianStats,
} from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });
};

export const useGetCustomerStats = () => {
  return useQuery({
    queryKey: ["customer-stats"],
    queryFn: getCustomerStats,
  });
};

export const useGetManagerStats = () => {
  return useQuery({
    queryKey: ["manager-stats"],
    queryFn: getManagerStats,
  });
};

export const useGetTechnicianStats = () => {
  return useQuery({
    queryKey: ["technician-stats"],
    queryFn: getTechnicianStats,
  });
};


export const useGetPublicStats = () => {
  return useQuery({
    queryKey: ["public-stats"],
    queryFn: getPublicStats
  })
}
