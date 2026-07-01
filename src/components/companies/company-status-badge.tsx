import { cn } from "@/lib/utils";
import { STATUS_COLORS, type CompanyStatus } from "@/lib/constants/companies";

export function CompanyStatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status as CompanyStatus] ?? {
    bg: "bg-gray-100",
    text: "text-gray-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        colors.bg,
        colors.text,
      )}
    >
      {status || "—"}
    </span>
  );
}
