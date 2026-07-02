import 'server-only';
import { unstable_cache } from 'next/cache';
import { serverGet } from '@/server/api';
import type { Company, CompanySummary, Contact, ContactSummary, SessionUser } from '@/types/crm';

const _getCompanies = unstable_cache(
  async (session: SessionUser) => {
    const result = await serverGet<{ companies: CompanySummary[] }>('getCompanies', session);
    if (!result.ok) return { companies: [] as CompanySummary[], error: result.error };
    return { companies: result.data.companies };
  },
  ['companies'],
  { revalidate: 60, tags: ['companies'] },
);

const _getCompany = unstable_cache(
  async (session: SessionUser, companyId: string) => {
    const result = await serverGet<{ company: Company }>('getCompany', session, { companyId });
    if (!result.ok) return { company: null as Company | null, error: result.error };
    return { company: result.data.company };
  },
  ['company'],
  { revalidate: 30, tags: ['companies'] },
);

const _getContacts = unstable_cache(
  async (session: SessionUser, companyId?: string) => {
    const result = await serverGet<{ contacts: ContactSummary[] }>(
      'getContacts',
      session,
      companyId ? { companyId } : undefined,
    );
    if (!result.ok) return { contacts: [] as ContactSummary[], error: result.error };
    return { contacts: result.data.contacts };
  },
  ['contacts'],
  { revalidate: 60, tags: ['contacts'] },
);

const _getContact = unstable_cache(
  async (session: SessionUser, contactId: string) => {
    const result = await serverGet<{ contact: Contact }>('getContact', session, { contactId });
    if (!result.ok) return { contact: null as Contact | null, error: result.error };
    return { contact: result.data.contact };
  },
  ['contact'],
  { revalidate: 30, tags: ['contacts'] },
);

export function getCompanies(session: SessionUser) {
  return _getCompanies(session);
}

export function getCompany(session: SessionUser, companyId: string) {
  return _getCompany(session, companyId);
}

export function getContacts(session: SessionUser, params?: { companyId?: string }) {
  return _getContacts(session, params?.companyId);
}

export function getContact(session: SessionUser, contactId: string) {
  return _getContact(session, contactId);
}
