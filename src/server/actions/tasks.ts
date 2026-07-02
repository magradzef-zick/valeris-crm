'use server';

import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireUser } from '@/server/auth/guards';
import { serverPost } from '@/server/api';
import type { Task } from '@/types/crm';

export type TaskActionResult = { error?: string } | { ok: true };

export async function createTaskAction(
  _prev: TaskActionResult | undefined,
  formData: FormData,
): Promise<TaskActionResult> {
  const session = await requireUser();
  const title = formData.get('title') as string;
  if (!title?.trim()) return { error: 'Task title is required' };

  const result = await serverPost<{ task_id: string }>('createTask', session, {
    title:       title.trim(),
    entity_type: formData.get('entity_type') as string || '',
    entity_id:   formData.get('entity_id')   as string || '',
    description: formData.get('description') as string || '',
    status:      formData.get('status')      as string || 'Open',
    priority:    formData.get('priority')    as string || 'Medium',
    assigned_to: formData.get('assigned_to') as string || '',
    due_date:    formData.get('due_date')    as string || '',
  });

  if (!result.ok) return { error: result.error };

  revalidateTag('tasks', {});
  revalidateTag('dashboard', {});
  revalidateTag('timeline', {});
  const entityType = formData.get('entity_type') as string;
  const entityId   = formData.get('entity_id') as string;
  if (entityType === 'Project' && entityId) {
    revalidatePath(`/projects/${entityId}`);
  }
  redirect(`/tasks/${result.data.task_id}`);
}

export async function updateTaskAction(
  _prev: TaskActionResult | undefined,
  formData: FormData,
): Promise<TaskActionResult> {
  const session = await requireUser();
  const taskId = formData.get('taskId') as string;
  if (!taskId) return { error: 'Task ID is required' };

  const WRITABLE = [
    'title', 'description', 'status', 'priority', 'assigned_to', 'due_date',
  ] as const;

  const fields: Record<string, string> = {};
  for (const key of WRITABLE) {
    const val = formData.get(key);
    if (typeof val === 'string') fields[key] = val;
  }

  const result = await serverPost<{ task: Task }>('updateTask', session, { taskId, fields });
  if (!result.ok) return { error: result.error };

  revalidateTag('tasks', {});
  revalidateTag('dashboard', {});
  revalidatePath('/tasks');
  revalidatePath(`/tasks/${taskId}`);

  // Invalidate the parent entity page so its task list reflects the change.
  const entityType = formData.get('entity_type') as string;
  const entityId   = formData.get('entity_id')   as string;
  if (entityType === 'Project' && entityId) revalidatePath(`/projects/${entityId}`);
  if (entityType === 'Lead'    && entityId) revalidatePath(`/leads/${entityId}`);

  revalidatePath('/dashboard');
  return { ok: true };
}
