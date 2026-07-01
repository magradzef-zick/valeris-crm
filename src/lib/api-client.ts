import type { ApiResponse } from '@/types/crm';

/**
 * Internal CRM API client — calls /api/crm (the server-side proxy),
 * which in turn forwards to the Apps Script backend. The browser never
 * communicates with Apps Script directly and never sees APPS_SCRIPT_URL.
 */

async function request<T>(
  method: 'GET' | 'POST',
  action: string,
  payload?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  try {
    let url = `/api/crm?action=${encodeURIComponent(action)}`;
    const init: RequestInit = { method };

    if (method === 'GET' && payload) {
      const params = new URLSearchParams({ action });
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined && val !== null) {
          params.set(key, String(val));
        }
      }
      url = `/api/crm?${params.toString()}`;
    }

    if (method === 'POST' && payload) {
      init.headers = { 'Content-Type': 'application/json' };
      init.body = JSON.stringify({ action, data: payload });
    }

    const res = await fetch(url, init);
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    return (await res.json()) as ApiResponse<T>;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export function crmGet<T>(
  action: string,
  params?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  return request<T>('GET', action, params);
}

export function crmPost<T>(
  action: string,
  data?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  return request<T>('POST', action, data);
}
