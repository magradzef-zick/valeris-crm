import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getTasks } from "@/server/queries/tasks";
import { TasksTable } from "@/components/tasks/tasks-table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Tasks — Valeris CRM" };

export default async function TasksPage() {
  const session = await requireUser();
  const { tasks, error } = await getTasks(session);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium">Tasks</h1>
          <p className="text-sm text-muted-foreground">All tasks across leads, projects, and contacts.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/tasks/new">
            <Plus className="h-3.5 w-3.5" />
            New task
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <TasksTable tasks={tasks} />
    </div>
  );
}
