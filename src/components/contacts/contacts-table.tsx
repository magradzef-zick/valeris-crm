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
import type { ContactSummary } from "@/types/crm";

const helper = createColumnHelper<ContactSummary>();

const columns = [
  helper.accessor("full_name", {
    header: "Name",
    cell: (info) => <span className="font-medium text-sm">{info.getValue() || "—"}</span>,
  }),
  helper.accessor("title", {
    header: "Title",
    cell: (info) => <span className="text-sm">{info.getValue() || "—"}</span>,
  }),
  helper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue() ? (
      <a href={`mailto:${info.getValue()}`} className="text-xs text-brand-green hover:underline" onClick={(e) => e.stopPropagation()}>
        {info.getValue()}
      </a>
    ) : <span className="text-xs text-muted-foreground">—</span>,
  }),
  helper.accessor("phone", {
    header: "Phone",
    cell: (info) => <span className="text-xs text-muted-foreground">{info.getValue() || "—"}</span>,
  }),
  helper.accessor("language", {
    header: "Language",
    cell: (info) => <span className="text-xs text-muted-foreground">{info.getValue() || "—"}</span>,
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        info.getValue() === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500",
      )}>
        {info.getValue() || "—"}
      </span>
    ),
  }),
  helper.accessor("is_primary", {
    header: "Primary",
    cell: (info) => info.getValue() ? (
      <span className="text-xs text-brand-green font-medium">Primary</span>
    ) : null,
  }),
];

export function ContactsTable({
  contacts,
  hideCompanyColumn,
}: {
  contacts: ContactSummary[];
  hideCompanyColumn?: boolean;
}) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: "full_name", desc: false }]);
  const [globalFilter, setGlobalFilter] = useState("");
  const table = useReactTable({
    data: contacts,
    columns,
    initialState: {
      columnVisibility: hideCompanyColumn ? { company_id: false } : {},
    },
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
            placeholder="Search contacts…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <span className="text-xs text-muted-foreground">{table.getRowModel().rows.length} contact{table.getRowModel().rows.length !== 1 ? "s" : ""}</span>
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
                  No contacts found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => router.push(`/contacts/${row.original.contact_id}`)}
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
