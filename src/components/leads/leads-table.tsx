"use client";

import { useState, useMemo } from "react";
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
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { LeadStatusBadge } from "./lead-status-badge";
import { LeadPriorityBadge } from "./lead-priority-badge";
import { LEAD_STATUSES, PRIORITIES, type LeadStatus, type Priority } from "@/lib/constants/leads";
import type { LeadSummary } from "@/types/crm";

const helper = createColumnHelper<LeadSummary>();

function formatDate(value: string | Date | undefined): string {
  if (!value) return "—";
  const d = new Date(value as string);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const columns = [
  helper.accessor("received", {
    header: "Received",
    cell: (info) => (
      <span className="whitespace-nowrap text-xs text-muted-foreground">
        {formatDate(info.getValue())}
      </span>
    ),
    sortingFn: "alphanumeric",
  }),
  helper.accessor("full_name", {
    header: "Name",
    cell: (info) => (
      <span className="font-medium text-sm">{info.getValue() || "—"}</span>
    ),
  }),
  helper.accessor("company_name", {
    header: "Company",
    cell: (info) => <span className="text-sm">{info.getValue() || "—"}</span>,
  }),
  helper.accessor("interest", {
    header: "Interest",
    cell: (info) => (
      <span className="text-xs text-muted-foreground">{info.getValue() || "—"}</span>
    ),
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => <LeadStatusBadge status={info.getValue()} />,
  }),
  helper.accessor("priority", {
    header: "Priority",
    cell: (info) => <LeadPriorityBadge priority={info.getValue()} />,
  }),
  helper.accessor("next_action_date", {
    header: "Next Action",
    cell: (info) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {info.getValue() ? formatDate(info.getValue()) : "—"}
      </span>
    ),
  }),
  helper.accessor("owner", {
    header: "Owner",
    cell: (info) => (
      <span className="text-xs text-muted-foreground">{info.getValue() || "Unassigned"}</span>
    ),
  }),
];

export function LeadsTable({ leads }: { leads: LeadSummary[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "received", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (priorityFilter && l.priority !== priorityFilter) return false;
      return true;
    });
  }, [leads, statusFilter, priorityFilter]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  const clearFilters = () => {
    setGlobalFilter("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  const hasFilters = globalFilter || statusFilter || priorityFilter;

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search name, company, email…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "")}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | "")}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}

        <span className="ml-auto text-xs text-muted-foreground">
          {table.getRowModel().rows.length} of {leads.length}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap select-none"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className={cn(
                          "flex items-center gap-1",
                          header.column.getCanSort() && "cursor-pointer hover:text-foreground",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="opacity-50">
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="h-3 w-3" />
                            ) : (
                              <ArrowUpDown className="h-3 w-3" />
                            )}
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
                <td
                  colSpan={columns.length}
                  className="px-3 py-10 text-center text-sm text-muted-foreground"
                >
                  No leads match the current filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => router.push(`/leads/${row.original.lead_id}`)}
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
