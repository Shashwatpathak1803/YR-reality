import { Home, Building2, Layers, Tag, MessageSquare, CalendarCheck, Users, Image, Star, HelpCircle, Settings, User } from "lucide-react";
import type { ComponentType } from "react";

export interface NavItem {
  title: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", to: "/dashboard", icon: Home },
  { title: "Properties", to: "/properties", icon: Building2 },
  { title: "Categories", to: "/categories", icon: Layers },
  { title: "Offers", to: "/offers", icon: Tag },
  { title: "Enquiries", to: "/enquiries", icon: MessageSquare },
  { title: "Site Visits", to: "/site-visits", icon: CalendarCheck },
  { title: "Customers", to: "/customers", icon: Users },
  { title: "Media Gallery", to: "/media", icon: Image },
  { title: "Testimonials", to: "/testimonials", icon: Star },
  { title: "FAQ", to: "/faq", icon: HelpCircle },
  { title: "Settings", to: "/settings", icon: Settings },
  { title: "Profile", to: "/profile", icon: User },
];

export const formatINR = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
};
