import { useQuery } from '@tanstack/react-query';
import { crmGet } from '@/lib/api-client';
import type {
  LeadSummary,
  CompanySummary,
  ContactSummary,
  ProjectSummary,
  TaskSummary,
  CrmUser,
  DashboardStats,
} from '@/types/crm';

// How long client-side cached data is considered fresh.
// Matches the React Query defaultOptions in providers.tsx — override per-query if needed.
export const STALE_TIME = 5 * 60 * 1000; // 5 minutes

// ─── Query keys ───────────────────────────────────────────────────────────────

export const QK = {
  leads:     ['leads',     'list'] as const,
  companies: ['companies', 'list'] as const,
  contacts:  ['contacts',  'list'] as const,
  projects:  ['projects',  'list'] as const,
  tasks:     ['tasks',     'list'] as const,
  users:     ['users',     'list'] as const,
  dashboard: ['dashboard'] as const,
} as const;

// ─── Client-side fetch functions (browser → /api/crm → Apps Script) ───────────
// These are the queryFn passed to useQuery. They run in the browser only.
// The /api/crm proxy injects session auth from the httpOnly cookie — the
// APPS_SCRIPT_URL never leaves the server.

export async function fetchLeads(): Promise<{ leads: LeadSummary[] }> {
  const r = await crmGet<{ leads: LeadSummary[] }>('getLeads');
  if (!r.ok) throw new Error(r.error);
  return r.data;
}

export async function fetchCompanies(): Promise<{ companies: CompanySummary[] }> {
  const r = await crmGet<{ companies: CompanySummary[] }>('getCompanies');
  if (!r.ok) throw new Error(r.error);
  return r.data;
}

export async function fetchContacts(): Promise<{ contacts: ContactSummary[] }> {
  const r = await crmGet<{ contacts: ContactSummary[] }>('getContacts');
  if (!r.ok) throw new Error(r.error);
  return r.data;
}

export async function fetchProjects(): Promise<{ projects: ProjectSummary[] }> {
  const r = await crmGet<{ projects: ProjectSummary[] }>('getProjects');
  if (!r.ok) throw new Error(r.error);
  return r.data;
}

export async function fetchTasks(): Promise<{ tasks: TaskSummary[] }> {
  const r = await crmGet<{ tasks: TaskSummary[] }>('getTasks');
  if (!r.ok) throw new Error(r.error);
  return r.data;
}

export async function fetchUsers(): Promise<{ users: CrmUser[] }> {
  const r = await crmGet<{ users: CrmUser[] }>('getUsers');
  if (!r.ok) throw new Error(r.error);
  return r.data;
}

export async function fetchDashboard(): Promise<{ stats: DashboardStats }> {
  const r = await crmGet<{ stats: DashboardStats }>('getDashboardStats');
  if (!r.ok) throw new Error(r.error);
  return r.data;
}

// ─── React Query hooks ────────────────────────────────────────────────────────
// staleTime: data from HydrationBoundary (server SSR) stays fresh for 5 minutes,
// so navigating back to a page within that window renders instantly from cache.

export function useLeads() {
  return useQuery({ queryKey: QK.leads, queryFn: fetchLeads, staleTime: STALE_TIME });
}

export function useCompanies() {
  return useQuery({ queryKey: QK.companies, queryFn: fetchCompanies, staleTime: STALE_TIME });
}

export function useContacts() {
  return useQuery({ queryKey: QK.contacts, queryFn: fetchContacts, staleTime: STALE_TIME });
}

export function useProjects() {
  return useQuery({ queryKey: QK.projects, queryFn: fetchProjects, staleTime: STALE_TIME });
}

export function useTasks() {
  return useQuery({ queryKey: QK.tasks, queryFn: fetchTasks, staleTime: STALE_TIME });
}

export function useUsers() {
  return useQuery({ queryKey: QK.users, queryFn: fetchUsers, staleTime: STALE_TIME });
}

export function useDashboard() {
  return useQuery({ queryKey: QK.dashboard, queryFn: fetchDashboard, staleTime: STALE_TIME });
}
