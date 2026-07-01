import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getUsers } from "@/server/queries/team";
import { TaskCreateForm } from "@/components/tasks/task-create-form";

export const metadata: Metadata = { title: "New Task — Valeris CRM" };

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ entityType?: string; entityId?: string }>;
}) {
  const session = await requireUser();
  const { entityType, entityId } = await searchParams;
  const { users } = await getUsers(session);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/tasks"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Tasks
        </Link>
        <h1 className="font-heading text-2xl font-medium">New task</h1>
      </div>
      <TaskCreateForm
        users={users}
        defaultEntityType={entityType}
        defaultEntityId={entityId}
      />
    </div>
  );
}
