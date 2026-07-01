"use client";

import { useActionState } from "react";
import { updateTaskAction } from "@/server/actions/tasks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TASK_STATUSES } from "@/lib/constants/tasks";
import type { Task, CrmUser } from "@/types/crm";

const SELECT_CLS = "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function TaskEditForm({ task, users }: { task: Task; users: CrmUser[] }) {
  const [result, action, isPending] = useActionState<
    { error?: string } | { ok: true } | undefined,
    FormData
  >(updateTaskAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="taskId" value={task.task_id} />

      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={task.title} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue={task.status} className={SELECT_CLS}>
            {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priority">Priority</Label>
          <select id="priority" name="priority" defaultValue={task.priority} className={SELECT_CLS}>
            {['High', 'Medium', 'Low'].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="assigned_to">Assigned to</Label>
          <select id="assigned_to" name="assigned_to" defaultValue={task.assigned_to} className={SELECT_CLS}>
            <option value="">Unassigned</option>
            {users.map((u) => <option key={u.user_id} value={u.user_id}>{u.full_name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="due_date">Due date</Label>
          <Input id="due_date" name="due_date" type="date"
            defaultValue={task.due_date ? String(task.due_date).slice(0, 10) : ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={task.description} rows={3} />
      </div>

      {result && 'error' in result && <p className="text-sm text-destructive">{result.error}</p>}
      {result && 'ok' in result && <p className="text-sm text-emerald-600">Saved.</p>}

      <Button type="submit" disabled={isPending} size="sm">
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
