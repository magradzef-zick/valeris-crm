import 'server-only';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/constants/cookie';
import type { SessionUser } from '@/types/crm';

export type { SessionUser as CurrentUser };

/**
 * Read the session cookie and return the current user, or redirect to /login.
 * Call this at the top of any Server Component or Server Action that requires auth.
 * The proxy already gates the (app) route group, but this provides defense-in-depth.
 */
export async function requireUser(): Promise<SessionUser> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;

  if (!raw) redirect('/login');

  let session: SessionUser;
  try {
    session = JSON.parse(raw) as SessionUser;
  } catch {
    redirect('/login');
  }

  if (!session.token || !session.userId || new Date(session.expiresAt) < new Date()) {
    redirect('/login');
  }

  return session;
}
