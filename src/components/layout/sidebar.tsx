import { SidebarNav } from "@/components/layout/sidebar-nav";

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-16 items-center px-6">
        <span className="font-heading text-xl font-medium text-sidebar-foreground">
          Valeris
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <SidebarNav />
      </div>
    </aside>
  );
}
