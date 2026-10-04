import { BookOpen, Bot, SquareTerminal } from "lucide-react";

const prefix = `/admin-dashboard`;

export const adminRoutes = [
  {
    title: "Dashboard",
    url: "#",
    icon: SquareTerminal,
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "Profile",
        url: `${prefix}/profile`,
      },
    ],
  },
  {
    title: "User Management",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "All Users",
        url: `${prefix}/users/all-users`,
      },
      {
        title: "Approve Manager",
        url: `${prefix}/approve-manager`,
      },
    ],
  },
  {
    title: "Service Management",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Services",
        url: `${prefix}/service/all-services`,
      },
      {
        title: "Todays Services",
        url: `${prefix}/service/today`,
      },
      {
        title: "Tutorials",
        url: "#",
      },
      {
        title: "Changelog",
        url: "#",
      },
    ],
  },
  {
    title: "Category Management",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "All Categories",
        url: `${prefix}/category/all-categories`,
      },
    ],
  },
  {
    title: "Region Management",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "All Regions",
        url: `${prefix}/region/all-regions`,
      },
    ],
  },
];
