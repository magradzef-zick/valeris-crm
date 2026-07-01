'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/server/auth/guards';
import { serverPost } from '@/server/api';
import type { Project } from '@/types/crm';

export type ProjectActionResult = { error?: string } | { ok: true };

export async function createProjectAction(
  _prev: ProjectActionResult | undefined,
  formData: FormData,
): Promise<ProjectActionResult> {
  const session = await requireUser();
  const name = formData.get('name') as string;
  if (!name?.trim()) return { error: 'Project name is required' };

  const result = await serverPost<{ project_id: string }>('createProject', session, {
    name:               name.trim(),
    lead_id:            formData.get('lead_id')             as string || '',
    company_id:         formData.get('company_id')          as string || '',
    contact_id:         formData.get('contact_id')          as string || '',
    service_line:       formData.get('service_line')        as string || '',
    trade_direction:    formData.get('trade_direction')     as string || '',
    status:             formData.get('status')              as string || 'Active',
    phase:              formData.get('phase')               as string || 'Discovery',
    priority:           formData.get('priority')            as string || 'Medium',
    owner_user_id:      formData.get('owner_user_id')       as string || '',
    operations_user_id: formData.get('operations_user_id') as string || '',
    start_date:         formData.get('start_date')          as string || '',
    target_end_date:    formData.get('target_end_date')     as string || '',
    description:        formData.get('description')         as string || '',
  });

  if (!result.ok) return { error: result.error };
  redirect(`/projects/${result.data.project_id}`);
}

export async function updateProjectAction(
  _prev: ProjectActionResult | undefined,
  formData: FormData,
): Promise<ProjectActionResult> {
  const session = await requireUser();
  const projectId = formData.get('projectId') as string;
  if (!projectId) return { error: 'Project ID is required' };

  const WRITABLE = [
    'name', 'service_line', 'trade_direction', 'status', 'phase', 'priority',
    'owner_user_id', 'operations_user_id', 'start_date', 'target_end_date',
    'actual_end_date', 'description', 'company_id', 'contact_id',
  ] as const;

  const fields: Record<string, string> = {};
  for (const key of WRITABLE) {
    const val = formData.get(key);
    if (typeof val === 'string') fields[key] = val;
  }

  const result = await serverPost<{ project: Project }>('updateProject', session, {
    projectId,
    fields,
  });

  if (!result.ok) return { error: result.error };

  revalidatePath('/projects');
  revalidatePath(`/projects/${projectId}`);
  return { ok: true };
}
