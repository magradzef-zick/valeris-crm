import { cn } from "@/lib/utils";
import { PRIORITY_COLORS, type Priority } from "@/lib/constants/leads";

export function LeadPriorityBadge({ priority }: { priority: string }) {
  const colors = PRIORITY_COLORS[priority as Priority] ?? {
    bg: "bg-gray-100",
    text: "text-gray-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        colors.bg,
        colors.text,
      )}
    >
      {priority || "—"}
    </span>
  );
}
