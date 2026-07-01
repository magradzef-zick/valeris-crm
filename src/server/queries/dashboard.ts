import 'server-only';
import { serverGet } from '@/server/api';
import type { DashboardStats, SessionUser } from '@/types/crm';

export async function getDashboardStats(
  session: SessionUser,
): Promise<{ stats: DashboardStats | null; error?: string }> {
  const result = await serverGet<{ stats: DashboardStats }>('getDashboardStats', session);
  if (!result.ok) return { stats: null, error: result.error };
  return { stats: result.data.stats };
}
