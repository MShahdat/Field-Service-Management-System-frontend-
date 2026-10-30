import DashboardPage from "@/components/dashboard/dashboard-page";
import { ReactNode } from "react";
import { SidebarMobileTrigger } from "@/components/dashboard/sidebar-mobile-trigger";
import AuthGuards from "@/components/auth/auth-guard";

const DashboardLayoutPage = ({ children }: { children: ReactNode }) => {
  return (
    <AuthGuards>
    <DashboardPage>
      {children}
      <SidebarMobileTrigger />
    </DashboardPage>
    </AuthGuards>
  );
};

export default DashboardLayoutPage;
