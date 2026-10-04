import { BookOpen, Bot, SquareTerminal } from "lucide-react";

const prefix = `/manager-dashboard`;

export const managerRoutes = [
  {
    title: "Dashboard",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
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
    title: "Service",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "My Region Service",
        url: `${prefix}/service/my-region-services`,
      },
      {
        title: "Todays Services",
        url: `${prefix}/service/today`,
      },
    ],
  },
  {
    title: "Payment",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Payments",
        url: `${prefix}/payments`,
      },
    ],
  },
];
