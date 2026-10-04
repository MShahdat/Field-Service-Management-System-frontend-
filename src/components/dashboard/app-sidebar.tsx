"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Logo } from "@/assets/logo";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useGetMe } from "@/hooks";
import { SidebarRoutes, UserRole } from "@/types";
import { adminRoutes } from "@/route/admin/admin.route";
import { customerRoutes } from "@/route/customer/customer.route";
import { technicianRoutes } from "@/route/technician/technician.route";
import { managerRoutes } from "@/route/manager/manager.route";

const sidebarRoutes: Partial<Record<UserRole, SidebarRoutes>> = {
  SUPER_ADMIN: adminRoutes,
  ADMIN: adminRoutes,
  CUSTOMER: customerRoutes,
  TECHNICIAN: technicianRoutes,
  MANAGER: managerRoutes,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading } = useGetMe();

  if (isLoading) {
    return;
  }

  const user = data?.data;
  // console.log('data from sidebar', user)

  if (!user) {
    return;
  }

  const role = user.role as UserRole;
  const routes: SidebarRoutes = sidebarRoutes[role] ?? [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={routes} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
