'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  QK,
  STALE_TIME,
  fetchLeads,
  fetchCompanies,
  fetchContacts,
  fetchProjects,
  fetchTasks,
  fetchUsers,
} from '@/lib/crm-queries';

/**
 * Fires 6 background prefetch queries immediately after the dashboard mounts.
 *
 * With the unified cache (/api/crm now goes through unstable_cache), each
 * prefetchQuery call warms the server-side data cache as well as the client-side
 * React Query cache.  When the user navigates to any list page, the SSR render
 * hits the already-warm unstable_cache (~23ms) instead of calling Apps Script
 * cold (~2000ms).
 *
 * getDashboardStats is intentionally excluded:
 *  - The dashboard page just finished rendering it — unstable_cache is already
 *    warm for that user's session.
 *  - The dashboard page is pure SSR (no useDashboard hook), so storing it in
 *    React Query cache has no consumer.
 *
 * prefetchQuery with staleTime is a no-op when the cache already has fresh data,
 * so repeated dashboard visits never trigger redundant refetches.
 */
export function Prefetcher() {
  const qc = useQueryClient();

  useEffect(() => {
    qc.prefetchQuery({ queryKey: QK.leads,     queryFn: fetchLeads,     staleTime: STALE_TIME });
    qc.prefetchQuery({ queryKey: QK.companies, queryFn: fetchCompanies, staleTime: STALE_TIME });
    qc.prefetchQuery({ queryKey: QK.contacts,  queryFn: fetchContacts,  staleTime: STALE_TIME });
    qc.prefetchQuery({ queryKey: QK.projects,  queryFn: fetchProjects,  staleTime: STALE_TIME });
    qc.prefetchQuery({ queryKey: QK.tasks,     queryFn: fetchTasks,     staleTime: STALE_TIME });
    qc.prefetchQuery({ queryKey: QK.users,     queryFn: fetchUsers,     staleTime: STALE_TIME });
  }, [qc]);

  return null;
}
