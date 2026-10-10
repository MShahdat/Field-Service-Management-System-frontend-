import apiClient from "@/lib/apiClient";

export const getAdminStats = () => {
  return apiClient("/analytics/admin");
};

export const getCustomerStats = () => {
  return apiClient("/analytics/customer");
};

export const getManagerStats = () => {
  return apiClient("/analytics/manager");
};

export const getTechnicianStats = () => {
  return apiClient("/analytics/technician");
};
