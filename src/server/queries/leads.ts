import 'server-only';
import { serverGet } from '@/server/api';
import type { Lead, LeadSummary, SessionUser, TimelineItem } from '@/types/crm';

export async function getLeads(
  session: SessionUser,
): Promise<{ leads: LeadSummary[]; error?: string }> {
  const result = await serverGet<{ leads: LeadSummary[] }>('getLeads', session);
  if (!result.ok) return { leads: [], error: result.error };
  return { leads: result.data.leads };
}

export async function getLead(
  session: SessionUser,
  leadId: string,
): Promise<{ lead: Lead | null; error?: string }> {
  const result = await serverGet<{ lead: Lead }>('getLead', session, { leadId });
  if (!result.ok) return { lead: null, error: result.error };
  return { lead: result.data.lead };
}

export async function getTimeline(
  session: SessionUser,
  entityType: string,
  entityId: string,
): Promise<{ items: TimelineItem[]; error?: string }> {
  const result = await serverGet<{ items: TimelineItem[] }>(
    'getTimeline',
    session,
    { entityType, entityId },
  );
  if (!result.ok) return { items: [], error: result.error };
  return { items: result.data.items };
}
