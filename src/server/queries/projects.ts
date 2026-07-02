import 'server-only';
import { unstable_cache } from 'next/cache';
import { serverGet } from '@/server/api';
import type { Project, ProjectSummary, SessionUser } from '@/types/crm';

const _getProjects = unstable_cache(
  async (session: SessionUser, companyId?: string, status?: string) => {
    const params: Record<string, string> = {};
    if (companyId) params.companyId = companyId;
    if (status) params.status = status;
    const result = await serverGet<{ projects: ProjectSummary[] }>(
      'getProjects',
      session,
      Object.keys(params).length ? params : undefined,
    );
    if (!result.ok) return { projects: [] as ProjectSummary[], error: result.error };
    return { projects: result.data.projects };
  },
  ['projects'],
  { revalidate: 60, tags: ['projects'] },
);

const _getProject = unstable_cache(
  async (session: SessionUser, projectId: string) => {
    const result = await serverGet<{ project: Project }>('getProject', session, { projectId });
    if (!result.ok) return { project: null as Project | null, error: result.error };
    return { project: result.data.project };
  },
  ['project'],
  { revalidate: 30, tags: ['projects'] },
);

export function getProjects(session: SessionUser, params?: { companyId?: string; status?: string }) {
  return _getProjects(session, params?.companyId, params?.status);
}

export function getProject(session: SessionUser, projectId: string) {
  return _getProject(session, projectId);
}
