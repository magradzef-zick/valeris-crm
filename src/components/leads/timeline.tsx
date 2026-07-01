import { MessageSquare, Activity as ActivityIcon } from "lucide-react";
import type { TimelineItem } from "@/types/crm";

function formatTimeAgo(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TimelineEntry({ item }: { item: TimelineItem }) {
  if (item._kind === "note") {
    return (
      <div className="flex gap-3">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100">
          <MessageSquare className="h-3 w-3 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm whitespace-pre-wrap">{item.content}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatTimeAgo(item.created_at)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
        <ActivityIcon className="h-3 w-3 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{item.summary}</p>
        {item.details && (
          <p className="text-xs text-muted-foreground mt-0.5">{item.details}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {formatTimeAgo(item.performed_at)}
        </p>
      </div>
    </div>
  );
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  if (!items.length) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No activity yet.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {items.map((item) => (
        <TimelineEntry
          key={item._kind === "note" ? item.note_id : item.activity_id}
          item={item}
        />
      ))}
    </div>
  );
}
