import 'server-only';
import { unstable_cache } from 'next/cache';
import { serverGet } from '@/server/api';
import type { DashboardStats, SessionUser } from '@/types/crm';

const _getDashboardStats = unstable_cache(
  async (session: SessionUser) => {
    // This function body runs only on a cache MISS.
    // If you never see this log, every request is a cache hit.
    const tGas = Date.now();
    console.log('[dashboard] cache MISS — fetching from Apps Script');
    const result = await serverGet<{ stats: DashboardStats }>('getDashboardStats', session);
    console.log(`[dashboard] Apps Script fetch: ${Date.now() - tGas} ms`);
    if (!result.ok) return { stats: null as DashboardStats | null, error: result.error };
    return { stats: result.data.stats };
  },
  ['dashboard'],
  { revalidate: 120, tags: ['dashboard'] },
);

export function getDashboardStats(session: SessionUser) {
  return _getDashboardStats(session);
}
