import { BookOpen, SquareTerminal } from "lucide-react";

const prefix = `/customer-dashboard`;

export const customerRoutes = [
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
    title: "Service Management",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Services",
        url: `${prefix}/service/my-services`,
      },
      {
        title: "Todays Service",
        url: `${prefix}/service/todays-service`,
      },
    ],
  },

  {
    title: "Order Management",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Orders",
        url: `${prefix}/order`,
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
        url: `${prefix}/payment/my-payment`,
      },
    ],
  },
];
