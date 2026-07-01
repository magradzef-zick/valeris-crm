import { cn } from "@/lib/utils";
import { PROJECT_STATUS_COLORS, PROJECT_PHASE_COLORS } from "@/lib/constants/projects";

export function ProjectStatusBadge({ status }: { status: string }) {
  const colors = PROJECT_STATUS_COLORS[status] ?? { bg: "bg-gray-100", text: "text-gray-600" };
  return (
    <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs font-medium", colors.bg, colors.text)}>
      {status}
    </span>
  );
}

export function ProjectPhaseBadge({ phase }: { phase: string }) {
  const colors = PROJECT_PHASE_COLORS[phase] ?? { bg: "bg-gray-100", text: "text-gray-600" };
  return (
    <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs font-medium", colors.bg, colors.text)}>
      {phase}
    </span>
  );
}
