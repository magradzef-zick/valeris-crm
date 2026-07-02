import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/constants/cookie';
import { dispatchCachedGet } from '@/server/crm-dispatch';
import type { SessionUser } from '@/types/crm';

async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE)?.value;
    if (!raw) return null;
    const session = JSON.parse(raw) as SessionUser;
    if (new Date(session.expiresAt) < new Date()) return null;
    return session;
  } catch {
    return null;
  }
}

function appsScriptUrl(): string {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) throw new Error('APPS_SCRIPT_URL is not configured');
  return url;
}

/**
 * GET /api/crm?action=<action>[&param=value…]
 *
 * All recognised read actions are dispatched through dispatchCachedGet(), which
 * calls the same unstable_cache-wrapped server functions that SSR page renders
 * use.  This means the Prefetcher and client-side React Query fetches share the
 * server-side data cache with Next.js page renders — no duplicate Apps Script
 * calls.
 *
 * Unknown actions fall through to the direct Apps Script proxy so that any
 * edge-case or future action still works without a code change here.
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: 'Authentication required', code: 'AUTH_REQUIRED' },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  if (!action) {
    return NextResponse.json({ ok: false, error: 'action is required' }, { status: 400 });
  }

  // Fast path: serve from the shared unstable_cache layer (same cache as SSR).
  const cached = await dispatchCachedGet(action, session, searchParams);
  if (cached !== null) {
    return NextResponse.json(cached);
  }

  // Fallback: direct proxy for actions not in the dispatch map.
  try {
    const params = new URLSearchParams(searchParams);
    params.set('userId', session.userId);
    params.set('token', session.token);
    const res = await fetch(`${appsScriptUrl()}?${params.toString()}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ok: false, error: 'Backend error' }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: 'Authentication required', code: 'AUTH_REQUIRED' },
      { status: 401 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const res = await fetch(appsScriptUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        ...body,
        auth: { userId: session.userId, token: session.token },
      }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ok: false, error: 'Backend error' }, { status: 502 });
  }
}
