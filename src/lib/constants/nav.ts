import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Building2, Contact, FolderKanban, CheckSquare, Users2, Settings } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads",     label: "Leads",     icon: Users },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/contacts",  label: "Contacts",  icon: Contact },
  { href: "/projects",  label: "Projects",  icon: FolderKanban },
  { href: "/tasks",     label: "Tasks",     icon: CheckSquare },
  { href: "/team",      label: "Team",      icon: Users2 },
  { href: "/settings",  label: "Settings",  icon: Settings },
];
