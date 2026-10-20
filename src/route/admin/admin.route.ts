import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Sparkles,
  Tags,
  Users,
  Wrench,
} from "lucide-react";

const prefix = `/admin-dashboard`;

export const adminRoutes = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
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
    icon: Users,
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
    icon: Wrench,
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
    title: "WorkOrder Manage",
    url: "#",
    icon: ClipboardList,
    items: [
      {
        title: "All Work Order",
        url: `${prefix}/workorder/all-workorder`,
      },
      {
        title: "Todays Order",
        url: `${prefix}/workorder/todays-order`,
      },
    ],
  },
  {
    title: "Category Manage",
    url: "#",
    icon: Tags,
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
    icon: MapPin,
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
    icon: Sparkles,
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
    icon: CreditCard,
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
    icon: MessageSquare,
    items: [
      {
        title: "Feedback",
        url: `${prefix}/feedback`,
      },
    ],
  },
];
