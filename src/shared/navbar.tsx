"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Contact,
  FolderKanban,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Logo } from "@/assets/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetMe, useLogout } from "@/hooks";
import GlobalLoading from "@/loading/loading";
import type { ILoggedUser } from "@/types/auth.types";
import { getDashboardUrl } from "@/utils";
import { ModeToggle } from "./theme";

export function Navbar() {
  const queryClient = useQueryClient();
  const { data, isPending } = useGetMe();
  const { mutate } = useLogout();

  const router = useRouter();
  const pathname = usePathname();
  console.log("user", data);

  if (isPending) {
    return <GlobalLoading />;
  }

  const user = data?.data as ILoggedUser | undefined;
  const dashboardUrl = getDashboardUrl(user?.role);

  const navLinks = [
    { label: "Home", href: "/", icon: LayoutDashboard },
    { label: "Technicians", href: "/technician", icon: Wrench },
    ...(dashboardUrl
      ? [{ label: "Dashboard", href: dashboardUrl, icon: LayoutDashboard }]
      : []),
    // { label: "Category", href: "/category", icon: LifeBuoy },
    { label: "Region", href: "/region", icon: LifeBuoy },
    { label: "Support", href: "/support", icon: LifeBuoy },
    { label: "About", href: "/about-us", icon: FolderKanban },
    { label: "Contact", href: "/contact", icon: Contact },
  ] as const;

  let userMenuItems: { label: string; href: string; icon: typeof User }[] = [];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (user) {
    userMenuItems = [
      { label: "Profile", href: `${dashboardUrl}/profile`, icon: User },
      { label: "Dashboard", href: `${dashboardUrl}`, icon: LayoutDashboard },
      { label: "Support", href: "/support", icon: LifeBuoy },
    ];
  }

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: (res) => {
        queryClient.removeQueries({
          queryKey: ["user"],
        });
        toast.success(res.message);
        router.push("/login");
        router.refresh();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[#150804] dark:bg-[#120603] text-white">
      <div className="mx-auto flex h-16 max-w-11/12 items-center justify-between gap-4">
        <div>
          <Logo />
        </div>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isActiveLink(link.href);
            return (
              <Button
                key={link.href}
                variant="ghost"
                size="default"
                asChild
                className={
                  isActive
                    ? "bg-white/10 text-white hover:bg-white/15 hover:text-white"
                    : undefined
                }
              >
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                >
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
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = isActiveLink(link.href);
                  return (
                    <DropdownMenuItem
                      key={link.href}
                      asChild
                      className={
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : undefined
                      }
                    >
                      <Link
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                      >
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
      <div className=" h-[2px] w-full bg-primary/20" />
    </header>
  );
}
