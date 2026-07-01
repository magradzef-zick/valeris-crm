"use client";

import { useActionState } from "react";
import { createTaskAction, type TaskActionResult } from "@/server/actions/tasks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TASK_STATUSES, TASK_ENTITY_TYPES } from "@/lib/constants/tasks";
import type { CrmUser } from "@/types/crm";

const SELECT_CLS = "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function TaskCreateForm({
  users,
  defaultEntityType,
  defaultEntityId,
}: {
  users: CrmUser[];
  defaultEntityType?: string;
  defaultEntityId?: string;
}) {
  const [result, action, isPending] = useActionState<
    TaskActionResult | undefined,
    FormData
  >(createTaskAction, undefined);

  return (
    <form action={action} className="space-y-4 max-w-xl">
      <div className="space-y-1.5">
        <Label htmlFor="title">Task title <span className="text-destructive">*</span></Label>
        <Input id="title" name="title" required placeholder="e.g. Send proposal to client" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue="Open" className={SELECT_CLS}>
            {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priority">Priority</Label>
          <select id="priority" name="priority" defaultValue="Medium" className={SELECT_CLS}>
            {['High', 'Medium', 'Low'].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="assigned_to">Assigned to</Label>
          <select id="assigned_to" name="assigned_to" className={SELECT_CLS}>
            <option value="">Unassigned</option>
            {users.map((u) => <option key={u.user_id} value={u.user_id}>{u.full_name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="due_date">Due date</Label>
          <Input id="due_date" name="due_date" type="date" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="entity_type">Linked entity type</Label>
          <select id="entity_type" name="entity_type" defaultValue={defaultEntityType ?? ""} className={SELECT_CLS}>
            <option value="">Not linked</option>
            {TASK_ENTITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="entity_id">Entity ID</Label>
          <Input id="entity_id" name="entity_id" defaultValue={defaultEntityId ?? ""} placeholder="e.g. PRJ-…" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Additional details…" rows={3} />
      </div>

      {result && 'error' in result && result.error && <p className="text-sm text-destructive">{result.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating…" : "Create task"}
      </Button>
    </form>
  );
}
