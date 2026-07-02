/**
 * Unified dispatcher for all CRM read actions.
 *
 * This is the single entry point called by the /api/crm GET route handler.
 * By routing through the same cached server functions used by SSR page renders,
 * client-side fetches (React Query, Prefetcher) share the same unstable_cache
 * layer instead of going to Apps Script directly.
 *
 * Returns ApiResponse<unknown> ready for NextResponse.json(), or null when the
 * action is not in the dispatch map (caller should fall back to direct proxy).
 */
import 'server-only';
import { getLeads, getLead, getTimeline } from './queries/leads';
import { getCompanies, getCompany, getContacts, getContact } from './queries/companies';
import { getProjects, getProject } from './queries/projects';
import { getTasks, getTask } from './queries/tasks';
import { getUsers } from './queries/team';
import { getDashboardStats } from './queries/dashboard';
import type { ApiResponse, SessionUser } from '@/types/crm';

type Resp = ApiResponse<unknown>;

function hit(data: object): Resp { return { ok: true, data }; }
function miss(error: string | undefined): Resp {
  return { ok: false, error: error ?? 'Unknown error' };
}

export async function dispatchCachedGet(
  action: string,
  session: SessionUser,
  params: URLSearchParams,
): Promise<Resp | null> {
  switch (action) {

    // ─── Leads ──────────────────────────────────────────────────────────────

    case 'getLeads': {
      const r = await getLeads(session);
      return r.error ? miss(r.error) : hit({ leads: r.leads });
    }
    case 'getLead': {
      const leadId = params.get('leadId') ?? '';
      if (!leadId) return miss('leadId is required');
      const r = await getLead(session, leadId);
      return r.error ? miss(r.error) : hit({ lead: r.lead });
    }
    case 'getTimeline': {
      const entityType = params.get('entityType') ?? '';
      const entityId   = params.get('entityId')   ?? '';
      if (!entityType || !entityId) return miss('entityType and entityId are required');
      const r = await getTimeline(session, entityType, entityId);
      return r.error ? miss(r.error) : hit({ items: r.items });
    }

    // ─── Companies & contacts ────────────────────────────────────────────────

    case 'getCompanies': {
      const r = await getCompanies(session);
      return r.error ? miss(r.error) : hit({ companies: r.companies });
    }
    case 'getCompany': {
      const companyId = params.get('companyId') ?? '';
      if (!companyId) return miss('companyId is required');
      const r = await getCompany(session, companyId);
      return r.error ? miss(r.error) : hit({ company: r.company });
    }
    case 'getContacts': {
      const companyId = params.get('companyId') ?? undefined;
      const r = await getContacts(session, companyId ? { companyId } : undefined);
      return r.error ? miss(r.error) : hit({ contacts: r.contacts });
    }
    case 'getContact': {
      const contactId = params.get('contactId') ?? '';
      if (!contactId) return miss('contactId is required');
      const r = await getContact(session, contactId);
      return r.error ? miss(r.error) : hit({ contact: r.contact });
    }

    // ─── Projects ────────────────────────────────────────────────────────────

    case 'getProjects': {
      const companyId = params.get('companyId') ?? undefined;
      const status    = params.get('status')    ?? undefined;
      const r = await getProjects(session, companyId || status ? { companyId, status } : undefined);
      return r.error ? miss(r.error) : hit({ projects: r.projects });
    }
    case 'getProject': {
      const projectId = params.get('projectId') ?? '';
      if (!projectId) return miss('projectId is required');
      const r = await getProject(session, projectId);
      return r.error ? miss(r.error) : hit({ project: r.project });
    }

    // ─── Tasks ───────────────────────────────────────────────────────────────

    case 'getTasks': {
      const entityType = params.get('entityType') ?? undefined;
      const entityId   = params.get('entityId')   ?? undefined;
      const assignedTo = params.get('assignedTo') ?? undefined;
      const status     = params.get('status')     ?? undefined;
      const hasFilter  = !!(entityType || entityId || assignedTo || status);
      const r = await getTasks(session, hasFilter ? { entityType, entityId, assignedTo, status } : undefined);
      return r.error ? miss(r.error) : hit({ tasks: r.tasks });
    }
    case 'getTask': {
      const taskId = params.get('taskId') ?? '';
      if (!taskId) return miss('taskId is required');
      const r = await getTask(session, taskId);
      return r.error ? miss(r.error) : hit({ task: r.task });
    }

    // ─── Team ────────────────────────────────────────────────────────────────

    case 'getUsers': {
      const r = await getUsers(session);
      return r.error ? miss(r.error) : hit({ users: r.users });
    }

    // ─── Dashboard ───────────────────────────────────────────────────────────

    case 'getDashboardStats': {
      const r = await getDashboardStats(session);
      if (r.error || !r.stats) return miss(r.error ?? 'Dashboard data unavailable');
      return hit({ stats: r.stats });
    }

    // ─── Not in dispatch map — caller may fall back to direct proxy ──────────

    default:
      return null;
  }
}
