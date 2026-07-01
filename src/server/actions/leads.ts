'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/server/auth/guards';
import { serverPost } from '@/server/api';
import type { Lead } from '@/types/crm';

export type UpdateLeadResult = { error: string } | { ok: true };

export async function updateLeadAction(
  _prev: UpdateLeadResult | undefined,
  formData: FormData,
): Promise<UpdateLeadResult> {
  const session = await requireUser();
  const leadId = formData.get('leadId') as string;
  if (!leadId) return { error: 'Lead ID is required' };

  const fields: Record<string, string> = {};
  const WRITABLE = [
    'status',
    'priority',
    'owner',
    'next_action',
    'next_action_date',
    'notes',
    'trade_direction',
    'company_id',
    'contact_id',
  ] as const;

  for (const key of WRITABLE) {
    const val = formData.get(key);
    if (typeof val === 'string') fields[key] = val;
  }

  const result = await serverPost<{ lead: Lead }>('updateLead', session, {
    leadId,
    fields,
  });

  if (!result.ok) return { error: result.error };

  revalidatePath('/leads');
  revalidatePath(`/leads/${leadId}`);
  return { ok: true };
}
