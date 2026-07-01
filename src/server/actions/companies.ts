'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/server/auth/guards';
import { serverPost } from '@/server/api';
import type { Company, Contact } from '@/types/crm';

export type CompanyActionResult = { error: string } | { ok: true };
export type ContactActionResult = { error: string } | { ok: true };

// ─── Company Actions ───────────────────────────────────────────────────────────

export async function createCompanyAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const session = await requireUser();

  const name = (formData.get('name') as string)?.trim();
  if (!name) return { error: 'Company name is required' };

  const data: Record<string, string> = {};
  for (const key of ['name', 'type', 'country', 'city', 'industry', 'trade_direction',
    'website', 'linkedin', 'email', 'phone', 'status', 'notes']) {
    const val = formData.get(key);
    if (typeof val === 'string') data[key] = val;
  }

  const result = await serverPost<{ company_id: string }>('createCompany', session, data);
  if (!result.ok) return { error: result.error };

  redirect(`/companies/${result.data.company_id}`);
}

export async function updateCompanyAction(
  _prev: CompanyActionResult | undefined,
  formData: FormData,
): Promise<CompanyActionResult> {
  const session = await requireUser();
  const companyId = formData.get('companyId') as string;
  if (!companyId) return { error: 'Company ID is required' };

  const fields: Record<string, string> = {};
  for (const key of ['name', 'type', 'country', 'city', 'industry', 'trade_direction',
    'website', 'linkedin', 'email', 'phone', 'status', 'notes', 'owner_user_id']) {
    const val = formData.get(key);
    if (typeof val === 'string') fields[key] = val;
  }

  const result = await serverPost<{ company: Company }>('updateCompany', session, {
    companyId,
    fields,
  });
  if (!result.ok) return { error: result.error };

  revalidatePath('/companies');
  revalidatePath(`/companies/${companyId}`);
  return { ok: true };
}

// ─── Contact Actions ───────────────────────────────────────────────────────────

export async function createContactAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const session = await requireUser();

  const firstName = (formData.get('first_name') as string)?.trim();
  const lastName = (formData.get('last_name') as string)?.trim();
  if (!firstName || !lastName) return { error: 'First name and last name are required' };

  const data: Record<string, string | boolean> = {};
  for (const key of ['first_name', 'last_name', 'company_id', 'title',
    'email', 'phone', 'linkedin', 'language', 'status']) {
    const val = formData.get(key);
    if (typeof val === 'string') data[key] = val;
  }
  data.is_primary = formData.get('is_primary') === 'on';

  const result = await serverPost<{ contact_id: string }>('createContact', session, data);
  if (!result.ok) return { error: result.error };

  redirect(`/contacts/${result.data.contact_id}`);
}

export async function updateContactAction(
  _prev: ContactActionResult | undefined,
  formData: FormData,
): Promise<ContactActionResult> {
  const session = await requireUser();
  const contactId = formData.get('contactId') as string;
  if (!contactId) return { error: 'Contact ID is required' };

  const fields: Record<string, string | boolean> = {};
  for (const key of ['first_name', 'last_name', 'company_id', 'title',
    'email', 'phone', 'linkedin', 'language', 'status', 'owner_user_id']) {
    const val = formData.get(key);
    if (typeof val === 'string') fields[key] = val;
  }
  fields.is_primary = formData.get('is_primary') === 'on';

  const result = await serverPost<{ contact: Contact }>('updateContact', session, {
    contactId,
    fields,
  });
  if (!result.ok) return { error: result.error };

  revalidatePath('/contacts');
  revalidatePath(`/contacts/${contactId}`);
  return { ok: true };
}
