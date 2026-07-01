import 'server-only';
import { serverGet } from '@/server/api';
import type { Project, ProjectSummary, SessionUser } from '@/types/crm';

export async function getProjects(
  session: SessionUser,
  params?: { companyId?: string; status?: string },
): Promise<{ projects: ProjectSummary[]; error?: string }> {
  const result = await serverGet<{ projects: ProjectSummary[] }>(
    'getProjects',
    session,
    params as Record<string, string> | undefined,
  );
  if (!result.ok) return { projects: [], error: result.error };
  return { projects: result.data.projects };
}

export async function getProject(
  session: SessionUser,
  projectId: string,
): Promise<{ project: Project | null; error?: string }> {
  const result = await serverGet<{ project: Project }>('getProject', session, { projectId });
  if (!result.ok) return { project: null, error: result.error };
  return { project: result.data.project };
}
