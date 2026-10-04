import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { ReactNode } from "react";

export default function DashboardPage({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="-ml-1" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
