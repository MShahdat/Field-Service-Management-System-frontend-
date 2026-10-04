import { BookOpen, SquareTerminal } from "lucide-react";

const prefix = `/technician-dashboard`;

export const technicianRoutes = [
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
        title: "My Services",
        url: `${prefix}/service/all-services`,
      },
      {
        title: "Todays Services",
        url: `${prefix}/service/today`,
      },
      {
        title: "Completed Service",
        url: `${prefix}/service/completed`,
      },
    ],
  },
  {
    title: "Payment",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "My Payments",
        url: `${prefix}/service/all-services`,
      },
    ],
  },
];
