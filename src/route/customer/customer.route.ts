import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Wrench,
} from "lucide-react";

const prefix = `/customer-dashboard`;

export const customerRoutes = [
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
    title: "Service Management",
    url: "#",
    icon: Wrench,
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
    icon: ClipboardList,
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
    icon: CreditCard,
    items: [
      {
        title: "My Payments",
        url: `${prefix}/payment/my-payment`,
      },
    ],
  },
  // {
  //   title: "Feedbacks",
  //   url: "#",
  //   icon: MessageSquare,
  //   items: [
  //     {
  //       title: "Feedback",
  //       url: `${prefix}/feedback`,
  //     },
  //   ],
  // },
];
