import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
}

export interface SidebarRoute {
  title: string;
  icon: LucideIcon;
  url: string;
  items?: SidebarItem[];
}

export type SidebarRoutes = SidebarRoute[];
