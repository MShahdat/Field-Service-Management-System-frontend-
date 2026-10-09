import RoleGuard from "@/components/auth/role-guard";
import { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return <RoleGuard roles={["ADMIN", "SUPER_ADMIN"]}>{children}</RoleGuard>;
};

export default AdminLayout;
