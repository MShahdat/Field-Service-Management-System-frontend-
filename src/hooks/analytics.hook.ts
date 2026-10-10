import { getAdminStats, getCustomerStats, getManagerStats, getTechnicianStats } from "@/api";
import { useQuery } from "@tanstack/react-query";



export const useGetAdminStats = () => {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
  });
}




export const useGetCustomerStats = () => {
  return useQuery({
    queryKey: ["customerStats"],
    queryFn: getCustomerStats,
  });
}


export const useGetManagerStats = () => {
  return useQuery({
    queryKey: ["managerStats"],
    queryFn: getManagerStats,
  });
}


export const useGetTechnicianStats = () => {
  return useQuery({
    queryKey: ["technicianStats"],
    queryFn: getTechnicianStats,
  });
}