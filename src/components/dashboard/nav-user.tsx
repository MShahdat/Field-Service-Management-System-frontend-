"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronsUpDown,
  CreditCard,
  HomeIcon,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Sun,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks";
import ProfileAvater from "@/shared/avater";
import type { ILoggedUser } from "@/types";
import { getDashboardUrl, getFallbackText } from "@/utils";

export function NavUser({ user }: { user: ILoggedUser }) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const { mutate } = useLogout();
  const router = useRouter();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: (res) => {
        queryClient.removeQueries({ queryKey: ["user"] });
        toast.success(res.message);
        router.push("/login");
        router.refresh();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  const dashboardUrl = getDashboardUrl(user.role);
  const profileUrl = dashboardUrl ? `${dashboardUrl}/profile` : "/login";
  const billingUrl =
    user.role === "CUSTOMER" && dashboardUrl
      ? `${dashboardUrl}/payment/my-payment`
      : dashboardUrl
        ? `${dashboardUrl}/payment`
        : "/login";

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
                <AvatarFallback className="rounded-lg bg-sidebar-accent font-semibold text-sidebar-accent-foreground">
                  {getFallbackText(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-[16px] leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
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
                <ProfileAvater
                  name={user.name}
                  imageUrl={user.profileImg ?? ""}
                />
                <div className="grid flex-1 text-left text-[16px] leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={profileUrl}>
                  <UserRound />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={billingUrl}>
                  <CreditCard />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">
                  <HomeIcon />
                  Home
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette />
                  <span>Theme</span>
                  <span className="ml-auto text-xs capitalize text-muted-foreground">
                    {theme ?? "system"}
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme ?? "system"}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem value="light">
                      <Sun />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <Moon />
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <Monitor />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleLogout()}
              className="font-medium text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive"
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
