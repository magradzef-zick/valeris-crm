import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getTask } from "@/server/queries/tasks";
import { getUsers } from "@/server/queries/team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { TaskEditForm } from "@/components/tasks/task-edit-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Task ${id} — Valeris CRM` };
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireUser();

  const [{ task }, { users }] = await Promise.all([
    getTask(session, id),
    getUsers(session),
  ]);

  if (!task) notFound();

  const assignee = users.find((u) => u.user_id === task.assigned_to);
  const creator  = users.find((u) => u.user_id === task.created_by);

  const entityLink = () => {
    if (!task.entity_type || !task.entity_id) return null;
    const paths: Record<string, string> = {
      Lead:    `/leads/${task.entity_id}`,
      Company: `/companies/${task.entity_id}`,
      Contact: `/contacts/${task.entity_id}`,
      Project: `/projects/${task.entity_id}`,
    };
    const href = paths[task.entity_type];
    if (!href) return null;
    return (
      <Link href={href} className="text-sm text-brand-green hover:underline">
        View {task.entity_type} →
      </Link>
    );
  };

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
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-2xl font-medium">{task.title}</h1>
            {task.entity_type && (
              <span className="text-xs text-muted-foreground">
                Linked to {task.entity_type}
              </span>
            )}
          </div>
          <TaskStatusBadge status={task.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Task details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Priority</dt>
                  <dd className="text-sm mt-0.5">{task.priority}</dd>
                </div>
                {assignee && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Assigned to</dt>
                    <dd className="text-sm mt-0.5">{assignee.full_name}</dd>
                  </div>
                )}
                {task.due_date && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Due date</dt>
                    <dd className="text-sm mt-0.5">{String(task.due_date).slice(0, 10)}</dd>
                  </div>
                )}
                {task.completed_at && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Completed</dt>
                    <dd className="text-sm mt-0.5">{String(task.completed_at).slice(0, 10)}</dd>
                  </div>
                )}
                {creator && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Created by</dt>
                    <dd className="text-sm mt-0.5">{creator.full_name}</dd>
                  </div>
                )}
              </dl>
              {task.description && (
                <>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.description}</p>
                </>
              )}
              {entityLink() && (
                <>
                  <Separator className="my-3" />
                  {entityLink()}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Edit task</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <TaskEditForm task={task} users={users} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
