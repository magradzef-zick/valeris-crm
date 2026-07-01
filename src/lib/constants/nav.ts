import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Building2, Contact } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

// Modules are added here as each milestone ships them -- an unbuilt module
// simply isn't in this list yet, rather than appearing as a dead link.
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard",  label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads",      label: "Leads",     icon: Users },
  { href: "/companies",  label: "Companies", icon: Building2 },
  { href: "/contacts",   label: "Contacts",  icon: Contact },
];
