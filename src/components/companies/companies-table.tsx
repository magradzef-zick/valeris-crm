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
import { CompanyStatusBadge } from "./company-status-badge";
import { COMPANY_STATUSES, type CompanyStatus } from "@/lib/constants/companies";
import type { CompanySummary } from "@/types/crm";

const helper = createColumnHelper<CompanySummary>();

const columns = [
  helper.accessor("name", {
    header: "Company",
    cell: (info) => <span className="font-medium text-sm">{info.getValue() || "—"}</span>,
  }),
  helper.accessor("type", {
    header: "Type",
    cell: (info) => <span className="text-sm">{info.getValue() || "—"}</span>,
  }),
  helper.accessor("country", {
    header: "Country",
    cell: (info) => <span className="text-sm">{info.getValue() || "—"}</span>,
  }),
  helper.accessor("industry", {
    header: "Industry",
    cell: (info) => <span className="text-xs text-muted-foreground">{info.getValue() || "—"}</span>,
  }),
  helper.accessor("trade_direction", {
    header: "Trade direction",
    cell: (info) => <span className="text-xs text-muted-foreground">{info.getValue() || "—"}</span>,
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => <CompanyStatusBadge status={info.getValue()} />,
  }),
  helper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue() ? (
      <a href={`mailto:${info.getValue()}`} className="text-xs text-brand-green hover:underline" onClick={(e) => e.stopPropagation()}>
        {info.getValue()}
      </a>
    ) : <span className="text-xs text-muted-foreground">—</span>,
  }),
];

export function CompaniesTable({ companies }: { companies: CompanySummary[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<CompanyStatus | "">("");

  const filtered = useMemo(
    () => companies.filter((c) => !statusFilter || c.status === statusFilter),
    [companies, statusFilter],
  );

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

  const hasFilters = globalFilter || statusFilter;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search name, country, industry…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CompanyStatus | "")}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">All statuses</option>
          {COMPANY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {hasFilters && (
          <button
            onClick={() => { setGlobalFilter(""); setStatusFilter(""); }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {table.getRowModel().rows.length} of {companies.length}
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
                <td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No companies match the current filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => router.push(`/companies/${row.original.company_id}`)}
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
