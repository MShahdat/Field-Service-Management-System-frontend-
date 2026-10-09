import RoleGuard from "@/components/auth/role-guard";
import React, { ReactNode } from "react";

const ManagerLayout = ({ children }: { children: ReactNode }) => {
  return <RoleGuard roles={["MANAGER"]}>{children}</RoleGuard>;
};

export default ManagerLayout;
