'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/server/auth/guards';
import { serverPost } from '@/server/api';
import type { Note } from '@/types/crm';

export type CreateNoteResult = { error: string } | { ok: true };

export async function createNoteAction(
  _prev: CreateNoteResult | undefined,
  formData: FormData,
): Promise<CreateNoteResult> {
  const session = await requireUser();

  const entityType = formData.get('entityType') as string;
  const entityId = formData.get('entityId') as string;
  const content = (formData.get('content') as string)?.trim();

  if (!entityType || !entityId) return { error: 'Missing entity reference' };
  if (!content) return { error: 'Note content cannot be empty' };

  const result = await serverPost<{ note: Note }>('createNote', session, {
    entityType,
    entityId,
    content,
  });

  if (!result.ok) return { error: result.error };

  // Revalidate the entity detail page so the timeline refreshes
  const pathMap: Record<string, string> = {
    Lead:    `/leads/${entityId}`,
    Company: `/companies/${entityId}`,
    Contact: `/contacts/${entityId}`,
    Project: `/projects/${entityId}`,
  };
  const path = pathMap[entityType];
  if (path) revalidatePath(path);

  return { ok: true };
}
