import 'server-only';
import { serverGet } from '@/server/api';
import type { CrmUser, SessionUser } from '@/types/crm';

export async function getUsers(
  session: SessionUser,
): Promise<{ users: CrmUser[]; error?: string }> {
  const result = await serverGet<{ users: CrmUser[] }>('getUsers', session);
  if (!result.ok) return { users: [], error: result.error };
  return { users: result.data.users };
}
