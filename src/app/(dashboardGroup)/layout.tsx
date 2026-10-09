import DashboardPage from "@/components/dashboard/dashboard-page";
import AuthGuards from "@/components/auth/auth-guard";
import { ReactNode } from "react";

const DashboardLayoutPage = ({ children }: { children: ReactNode }) => {
  return (
    // <AuthGuards>
    <DashboardPage>{children}</DashboardPage>
    // </AuthGuards>
  );
};

export default DashboardLayoutPage;
