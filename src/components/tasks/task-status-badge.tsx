import { cn } from "@/lib/utils";
import { TASK_STATUS_COLORS } from "@/lib/constants/tasks";

export function TaskStatusBadge({ status }: { status: string }) {
  const colors = TASK_STATUS_COLORS[status] ?? { bg: "bg-gray-100", text: "text-gray-600" };
  return (
    <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs font-medium", colors.bg, colors.text)}>
      {status}
    </span>
  );
}
