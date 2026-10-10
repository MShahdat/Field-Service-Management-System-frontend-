"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  User,
  LifeBuoy,
  LogOut,
  Menu,
  Contact,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useGetMe, useLogout } from "@/hooks";
import { Logo } from "@/assets/logo";
import { ILoggedUser } from "@/types/auth.types";
import { getDashboardUrl } from "@/utils";
import { ModeToggle } from "./theme";

export function Navbar() {
  const { data } = useGetMe();
  console.log("user", data);

  const user = data?.data as ILoggedUser | undefined;
  const dashboardUrl = getDashboardUrl(user?.role);

  const navLinks = [
    { label: "Home", href: "/", icon: LayoutDashboard },
    { label: "Technicians", href: "/technicians", icon: BarChart3 },
    ...(dashboardUrl
      ? [{ label: "Dashboard", href: dashboardUrl, icon: LayoutDashboard }]
      : []),
    { label: "About", href: "/about-us", icon: FolderKanban },
    { label: "Contact", href: "/contact", icon: Contact },
  ] as const;

  let userMenuItems: { label: string; href: string; icon: typeof User }[] = [];

  if (user) {
    userMenuItems = [
      { label: "Profile", href: `${dashboardUrl}/profile`, icon: User },
      { label: "Dashboard", href: `${dashboardUrl}`, icon: LayoutDashboard },
      { label: "Support", href: "/support", icon: LifeBuoy },
    ];
  }

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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[#1e0801] text-white">
      <div className="mx-auto flex h-16 max-w-11/12 items-center justify-between gap-4">
        <div>
          <Logo />
        </div>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button key={link.href} variant="ghost" size="default" asChild>
                <Link href={link.href}>
                  <Icon data-icon="inline-start" />
                  {link.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Mobile nav */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href}>
                        <Icon />
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="px-1 flex items-center gap-1.5">
            {/* theme */}
            <ModeToggle />
            <Bell className="size-5" />
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="User menu"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={user.profileImg} alt="profileImge" />
                      <AvatarFallback>
                        <img
                          src={
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                          }
                          alt="fallback"
                          className="object-cover rounded-full"
                        />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white text-neutral-900"
                >
                  <div className="flex flex-col px-1.5 py-1.5">
                    <span className="text-sm font-medium text-neutral-900">
                      {user.name}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {user.email}
                    </span>
                  </div>
                  <DropdownMenuSeparator className="bg-neutral-200" />
                  <DropdownMenuGroup>
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem
                          key={item.href}
                          asChild
                          className="text-neutral-900 focus:bg-neutral-300 focus:text-neutral-900 [&_svg]:text-neutral-900! [&_svg_*]:text-neutral-900!"
                        >
                          <Link href={item.href}>
                            <Icon />
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-neutral-200" />
                  <DropdownMenuItem
                    onClick={() => handleLogout()}
                    className="text-red-600! focus:bg-red-50 focus:text-red-600! [&_svg]:text-red-600! [&_svg_*]:text-red-600!"
                  >
                    <LogOut />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
      <div className=" h-[2px] w-full bg-primary/40" />
    </header>
  );
}
