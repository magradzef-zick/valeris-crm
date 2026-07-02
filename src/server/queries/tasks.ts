import 'server-only';
import { unstable_cache } from 'next/cache';
import { serverGet } from '@/server/api';
import type { Task, TaskSummary, SessionUser } from '@/types/crm';

const _getTasks = unstable_cache(
  async (
    session: SessionUser,
    entityType?: string,
    entityId?: string,
    assignedTo?: string,
    status?: string,
  ) => {
    const params: Record<string, string> = {};
    if (entityType) params.entityType = entityType;
    if (entityId) params.entityId = entityId;
    if (assignedTo) params.assignedTo = assignedTo;
    if (status) params.status = status;
    const result = await serverGet<{ tasks: TaskSummary[] }>(
      'getTasks',
      session,
      Object.keys(params).length ? params : undefined,
    );
    if (!result.ok) return { tasks: [] as TaskSummary[], error: result.error };
    return { tasks: result.data.tasks };
  },
  ['tasks'],
  { revalidate: 60, tags: ['tasks'] },
);

const _getTask = unstable_cache(
  async (session: SessionUser, taskId: string) => {
    const result = await serverGet<{ task: Task }>('getTask', session, { taskId });
    if (!result.ok) return { task: null as Task | null, error: result.error };
    return { task: result.data.task };
  },
  ['task'],
  { revalidate: 30, tags: ['tasks'] },
);

export function getTasks(
  session: SessionUser,
  params?: { entityType?: string; entityId?: string; assignedTo?: string; status?: string },
) {
  return _getTasks(session, params?.entityType, params?.entityId, params?.assignedTo, params?.status);
}

export function getTask(session: SessionUser, taskId: string) {
  return _getTask(session, taskId);
}
