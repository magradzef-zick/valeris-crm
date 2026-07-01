"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ProjectStatusBadge, ProjectPhaseBadge } from "./project-status-badge";
import type { ProjectSummary } from "@/types/crm";

const helper = createColumnHelper<ProjectSummary>();

const columns = [
  helper.accessor("name", {
    header: "Project",
    cell: (info) => <span className="font-medium text-sm">{info.getValue()}</span>,
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => <ProjectStatusBadge status={info.getValue()} />,
  }),
  helper.accessor("phase", {
    header: "Phase",
    cell: (info) => <ProjectPhaseBadge phase={info.getValue()} />,
  }),
  helper.accessor("priority", {
    header: "Priority",
    cell: (info) => <span className="text-xs text-muted-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("service_line", {
    header: "Service",
    cell: (info) => <span className="text-xs text-muted-foreground">{info.getValue() || "—"}</span>,
  }),
  helper.accessor("start_date", {
    header: "Start",
    cell: (info) => {
      const v = info.getValue();
      if (!v) return <span className="text-xs text-muted-foreground">—</span>;
      try { return <span className="text-xs">{new Date(v).toLocaleDateString()}</span>; } catch { return <span className="text-xs">{v}</span>; }
    },
  }),
  helper.accessor("target_end_date", {
    header: "Due",
    cell: (info) => {
      const v = info.getValue();
      if (!v) return <span className="text-xs text-muted-foreground">—</span>;
      try { return <span className="text-xs">{new Date(v).toLocaleDateString()}</span>; } catch { return <span className="text-xs">{v}</span>; }
    },
  }),
];

export function ProjectsTable({ projects }: { projects: ProjectSummary[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: projects,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {table.getRowModel().rows.length} project{table.getRowModel().rows.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="rounded-lg border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap select-none">
                    {header.isPlaceholder ? null : (
                      <button
                        className={cn("flex items-center gap-1", header.column.getCanSort() && "cursor-pointer hover:text-foreground")}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="opacity-50">
                            {header.column.getIsSorted() === "asc" ? <ArrowUp className="h-3 w-3" /> :
                             header.column.getIsSorted() === "desc" ? <ArrowDown className="h-3 w-3" /> :
                             <ArrowUpDown className="h-3 w-3" />}
                          </span>
                        )}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No projects found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => router.push(`/projects/${row.original.project_id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
