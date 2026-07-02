import 'server-only';
import { unstable_cache } from 'next/cache';
import { serverGet } from '@/server/api';
import type { CrmUser, SessionUser } from '@/types/crm';

const _getUsers = unstable_cache(
  async (session: SessionUser) => {
    const result = await serverGet<{ users: CrmUser[] }>('getUsers', session);
    if (!result.ok) return { users: [] as CrmUser[], error: result.error };
    return { users: result.data.users };
  },
  ['users'],
  { revalidate: 300, tags: ['users'] },
);

export function getUsers(session: SessionUser) {
  return _getUsers(session);
}
