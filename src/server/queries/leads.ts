import 'server-only';
import { unstable_cache } from 'next/cache';
import { serverGet } from '@/server/api';
import type { Lead, LeadSummary, SessionUser, TimelineItem } from '@/types/crm';

const _getLeads = unstable_cache(
  async (session: SessionUser) => {
    const result = await serverGet<{ leads: LeadSummary[] }>('getLeads', session);
    if (!result.ok) return { leads: [] as LeadSummary[], error: result.error };
    return { leads: result.data.leads };
  },
  ['leads'],
  { revalidate: 60, tags: ['leads'] },
);

const _getLead = unstable_cache(
  async (session: SessionUser, leadId: string) => {
    const result = await serverGet<{ lead: Lead }>('getLead', session, { leadId });
    if (!result.ok) return { lead: null as Lead | null, error: result.error };
    return { lead: result.data.lead };
  },
  ['lead'],
  { revalidate: 30, tags: ['leads'] },
);

const _getTimeline = unstable_cache(
  async (session: SessionUser, entityType: string, entityId: string) => {
    const result = await serverGet<{ items: TimelineItem[] }>(
      'getTimeline',
      session,
      { entityType, entityId },
    );
    if (!result.ok) return { items: [] as TimelineItem[], error: result.error };
    return { items: result.data.items };
  },
  ['timeline'],
  { revalidate: 30, tags: ['timeline'] },
);

export function getLeads(session: SessionUser) {
  return _getLeads(session);
}

export function getLead(session: SessionUser, leadId: string) {
  return _getLead(session, leadId);
}

export function getTimeline(session: SessionUser, entityType: string, entityId: string) {
  return _getTimeline(session, entityType, entityId);
}
