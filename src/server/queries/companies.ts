import 'server-only';
import { serverGet } from '@/server/api';
import type { Company, CompanySummary, Contact, ContactSummary, SessionUser } from '@/types/crm';

export async function getCompanies(
  session: SessionUser,
): Promise<{ companies: CompanySummary[]; error?: string }> {
  const result = await serverGet<{ companies: CompanySummary[] }>('getCompanies', session);
  if (!result.ok) return { companies: [], error: result.error };
  return { companies: result.data.companies };
}

export async function getCompany(
  session: SessionUser,
  companyId: string,
): Promise<{ company: Company | null; error?: string }> {
  const result = await serverGet<{ company: Company }>('getCompany', session, { companyId });
  if (!result.ok) return { company: null, error: result.error };
  return { company: result.data.company };
}

export async function getContacts(
  session: SessionUser,
  params?: { companyId?: string },
): Promise<{ contacts: ContactSummary[]; error?: string }> {
  const queryParams: Record<string, string> = {};
  if (params?.companyId) queryParams.companyId = params.companyId;

  const result = await serverGet<{ contacts: ContactSummary[] }>('getContacts', session, queryParams);
  if (!result.ok) return { contacts: [], error: result.error };
  return { contacts: result.data.contacts };
}

export async function getContact(
  session: SessionUser,
  contactId: string,
): Promise<{ contact: Contact | null; error?: string }> {
  const result = await serverGet<{ contact: Contact }>('getContact', session, { contactId });
  if (!result.ok) return { contact: null, error: result.error };
  return { contact: result.data.contact };
}
