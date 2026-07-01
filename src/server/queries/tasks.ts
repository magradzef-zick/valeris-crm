import 'server-only';
import { serverGet } from '@/server/api';
import type { Task, TaskSummary, SessionUser } from '@/types/crm';

export async function getTasks(
  session: SessionUser,
  params?: { entityType?: string; entityId?: string; assignedTo?: string; status?: string },
): Promise<{ tasks: TaskSummary[]; error?: string }> {
  const result = await serverGet<{ tasks: TaskSummary[] }>(
    'getTasks',
    session,
    params as Record<string, string> | undefined,
  );
  if (!result.ok) return { tasks: [], error: result.error };
  return { tasks: result.data.tasks };
}

export async function getTask(
  session: SessionUser,
  taskId: string,
): Promise<{ task: Task | null; error?: string }> {
  const result = await serverGet<{ task: Task }>('getTask', session, { taskId });
  if (!result.ok) return { task: null, error: result.error };
  return { task: result.data.task };
}
