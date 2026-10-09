import RoleGuard from "@/components/auth/role-guard";
import React, { ReactNode } from "react";

const CustomerLayout = ({ children }: { children: ReactNode }) => {
  return <RoleGuard roles={["CUSTOMER"]}>{children}</RoleGuard>;
};

export default CustomerLayout;
