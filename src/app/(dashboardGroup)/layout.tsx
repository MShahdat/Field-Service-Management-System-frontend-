import DashboardPage from "@/components/dashboard/dashboard-page";
import { ReactNode } from "react";

const DashboardLayoutPage = ({ children }: { children: ReactNode }) => {
  return <DashboardPage>{children}</DashboardPage>;
};

export default DashboardLayoutPage;
