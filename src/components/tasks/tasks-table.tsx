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
import { TaskStatusBadge } from "./task-status-badge";
import type { TaskSummary } from "@/types/crm";

const helper = createColumnHelper<TaskSummary>();

function DueDateCell({ value }: { value: string }) {
  if (!value) return <span className="text-xs text-muted-foreground">—</span>;
  try {
    const date = new Date(value);
    const isOverdue = date < new Date() && true;
    return (
      <span className={cn("text-xs", isOverdue ? "text-red-600 font-medium" : "")}>
        {date.toLocaleDateString()}
      </span>
    );
  } catch {
    return <span className="text-xs">{value}</span>;
  }
}

const columns = [
  helper.accessor("title", {
    header: "Task",
    cell: (info) => <span className="font-medium text-sm">{info.getValue()}</span>,
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => <TaskStatusBadge status={info.getValue()} />,
  }),
  helper.accessor("priority", {
    header: "Priority",
    cell: (info) => <span className="text-xs text-muted-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("entity_type", {
    header: "Linked to",
    cell: (info) => {
      const type = info.getValue();
      return type ? (
        <span className="text-xs text-muted-foreground">{type}</span>
      ) : <span className="text-xs text-muted-foreground">—</span>;
    },
  }),
  helper.accessor("due_date", {
    header: "Due",
    cell: (info) => <DueDateCell value={String(info.getValue() ?? "")} />,
  }),
];

export function TasksTable({ tasks }: { tasks: TaskSummary[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: tasks,
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
            placeholder="Search tasks…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {table.getRowModel().rows.length} task{table.getRowModel().rows.length !== 1 ? "s" : ""}
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
                  No tasks found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => router.push(`/tasks/${row.original.task_id}`)}
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
