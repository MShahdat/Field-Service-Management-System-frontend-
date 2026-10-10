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
    title: "User Manage",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "All Users",
        url: `${prefix}/user`,
      },
      {
        title: "Approve Manager",
        url: `${prefix}/approve-manager`,
      },
    ],
  },
  {
    title: "Service Manage",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Services",
        url: `${prefix}/service/all-services`,
      },
      {
        title: "Todays Services",
        url: `${prefix}/service/todays-services`,
      },
    ],
  },
  {
    title: "Category Manage",
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
    title: "Region Manage",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "All Regions",
        url: `${prefix}/region/all-regions`,
      },
    ],
  },
  {
    title: "Skill Manage",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "All Skills",
        url: `${prefix}/skill/all-skills`,
      },
    ],
  },
  {
    title: "Payments",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "Payment",
        url: `${prefix}/payment`,
      },
    ],
  },
  {
    title: "Feedbacks",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "Feedback",
        url: `${prefix}/feedback`,
      },
    ],
  },
];
