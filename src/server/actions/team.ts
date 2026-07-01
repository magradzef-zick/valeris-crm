'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireUser } from '@/server/auth/guards';
import { isOwnerOrAdmin } from '@/server/auth/permissions';
import { serverPost } from '@/server/api';

export type TeamActionResult = { error?: string } | { ok: true };

export async function createUserAction(
  _prev: TeamActionResult | undefined,
  formData: FormData,
): Promise<TeamActionResult> {
  const session = await requireUser();
  if (!isOwnerOrAdmin(session.role)) return { error: 'Only Owner or Administrator can add team members' };

  const email    = (formData.get('email')     as string)?.trim();
  const fullName = (formData.get('full_name') as string)?.trim();
  const role     = formData.get('role')     as string;
  const password = formData.get('password') as string;

  if (!email || !fullName || !password) return { error: 'Email, name, and password are required' };

  const result = await serverPost<{ user_id: string }>('createUser', session, {
    email,
    full_name: fullName,
    role:      role || 'Sales',
    password,
  });

  if (!result.ok) return { error: result.error };
  revalidatePath('/team');
  redirect('/team');
}

export async function updateUserAction(
  _prev: TeamActionResult | undefined,
  formData: FormData,
): Promise<TeamActionResult> {
  const session = await requireUser();
  if (!isOwnerOrAdmin(session.role)) return { error: 'Permission denied' };

  const userId = formData.get('userId') as string;
  if (!userId) return { error: 'User ID is required' };

  const fields: Record<string, string> = {};
  const role   = formData.get('role')   as string;
  const status = formData.get('status') as string;
  if (role)   fields.role   = role;
  if (status) fields.status = status;

  const result = await serverPost('updateUser', session, { userId, fields });
  if (!result.ok) return { error: (result as { ok: false; error: string }).error };

  revalidatePath('/team');
  return { ok: true };
}
