import 'server-only';
import type { ApiResponse, SessionUser } from '@/types/crm';

function getUrl(): string {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) throw new Error('APPS_SCRIPT_URL is not configured');
  return url;
}

/**
 * Server-side read from Apps Script via POST.
 * Session credentials travel in the request body (not URL params) to avoid
 * session tokens appearing in server access logs and Apps Script execution logs.
 */
export async function serverGet<T>(
  action: string,
  session: SessionUser,
  params?: Record<string, string>,
): Promise<ApiResponse<T>> {
  return serverPost<T>(action, session, params);
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
      signal: AbortSignal.timeout(20_000),
    });
    return (await res.json()) as ApiResponse<T>;
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return { ok: false, error: 'Request timed out. Apps Script may be starting up — try again.' };
    }
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}
