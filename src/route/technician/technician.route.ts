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
    title: "Work Order",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "My Work Order",
        url: `${prefix}/workorder/my-order`,
      },
      {
        title: "Todays Order",
        url: `${prefix}/workorder/todays-order`,
      },
      {
        title: "Incoming Order",
        url: `${prefix}/workorder/incoming-order`,
      },
    ],
  },
];
