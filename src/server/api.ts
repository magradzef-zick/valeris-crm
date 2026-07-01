import 'server-only';
import type { ApiResponse, SessionUser } from '@/types/crm';

function getUrl(): string {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) throw new Error('APPS_SCRIPT_URL is not configured');
  return url;
}

/**
 * Server-side GET to Apps Script.
 * Used in Server Components and Server Actions — never call from Client Components.
 * Injects the session credentials as URL params (Apps Script reads e.parameter).
 */
export async function serverGet<T>(
  action: string,
  session: SessionUser,
  params?: Record<string, string>,
): Promise<ApiResponse<T>> {
  let url: string;
  try {
    url = getUrl();
  } catch {
    return { ok: false, error: 'CRM backend is not configured' };
  }

  const search = new URLSearchParams({
    action,
    userId: session.userId,
    token: session.token,
    ...params,
  });

  try {
    const res = await fetch(`${url}?${search.toString()}`, {
      next: { revalidate: 0 },
    });
    return (await res.json()) as ApiResponse<T>;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Server-side POST to Apps Script.
 * Used in Server Actions — never call from Client Components.
 * Injects the session credentials as { auth: { userId, token } } in the body.
 */
export async function serverPost<T>(
  action: string,
  session: SessionUser,
  data?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  let url: string;
  try {
    url = getUrl();
  } catch {
    return { ok: false, error: 'CRM backend is not configured' };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action,
        auth: { userId: session.userId, token: session.token },
        data: data ?? {},
      }),
    });
    return (await res.json()) as ApiResponse<T>;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}
