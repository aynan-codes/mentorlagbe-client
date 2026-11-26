import {
  Home,
  BookOpen,
  CreditCard,
  Info,
  LayoutDashboard,
} from "lucide-react";

export const publicNavigation = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Find Tutors",
    href: "/tuitions",
    icon: BookOpen,
  },
  {
    title: "Pricing",
    href: "/pricing",
    icon: CreditCard,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
];

export const dashboardNavigation = {
  title: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
};