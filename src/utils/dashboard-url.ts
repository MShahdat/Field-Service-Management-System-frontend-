import type { UserRole } from "@/types";

export const getDashboardUrl = (role?: UserRole | string | null) => {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin-dashboard";
    case "MANAGER":
      return "/manager-dashboard";
    case "TECHNICIAN":
      return "/technician-dashboard";
    case "CUSTOMER":
      return "/customer-dashboard";
    default:
      return undefined;
  }
};
