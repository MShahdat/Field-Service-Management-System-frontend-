import DashboardPage from "@/components/dashboard/dashboard-page";
import { Navbar } from "@/shared/navbar";
import { ReactNode } from "react";

const DashboardLayoutPage = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      {/* <Navbar/> */}
      <DashboardPage>{children}</DashboardPage>
    </div>
  );
};

export default DashboardLayoutPage;
