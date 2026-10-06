"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { getFallbackText } from "@/utils";
import ProfileAvater from "@/shared/avater";
import { useLogout } from "@/hooks";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export function NavUser({ user }: { user: any }) {
  const { isMobile } = useSidebar();

  const { mutate } = useLogout();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: (res) => {
        toast.success(res.message);
        redirect("/login");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarImage src={user.profileImg} alt={user.name} />
                <AvatarFallback className=" rounded-full text-black font-bold">
                  {getFallbackText(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-[16px] leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {/* <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarImage src={user.prifileImg} alt={user.name} />
                  <AvatarFallback className="rounded-full text-black font-bold">
                    {getFallbackText(user.name)}
                  </AvatarFallback>
                </Avatar> */}
                <ProfileAvater name={user.name} imageUrl={user.profileImg} />
                <div className="grid flex-1 text-left text-[16px] leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleLogout()}
              className="text-red-700 font-semibold"
            >
              <LogOut />
              <p>Log out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
