import RoleGuard from "@/components/auth/role-guard";
import React, { ReactNode } from "react";

const TechnicianLayout = ({ children }: { children: ReactNode }) => {
  return <RoleGuard roles={["TECHNICIAN"]}>{children}</RoleGuard>;
};

export default TechnicianLayout;
