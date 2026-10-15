import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Wrench,
} from "lucide-react";

const prefix = `/manager-dashboard`;

export const managerRoutes = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
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
    icon: Wrench,
    items: [
      {
        title: "My Region Service",
        url: `${prefix}/service/my-region-services`,
      },
      {
        title: "Incoming Services",
        url: `${prefix}/service/incoming-services`,
      },
      {
        title: "Todays Services",
        url: `${prefix}/service/todays-services`,
      },
    ],
  },
  {
    title: "Work Order",
    url: "#",
    icon: ClipboardList,
    items: [
      {
        title: "Work Order",
        url: `${prefix}/workorder/my-order`,
      },
      {
        title: "Todays Order",
        url: `${prefix}/workorder/todays-order`,
      },
    ],
  },
  {
    title: "Payment",
    url: "#",
    icon: CreditCard,
    items: [
      {
        title: "Payments",
        url: `${prefix}/payment`,
      },
    ],
  },
];
