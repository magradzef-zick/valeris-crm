import { NextResponse } from 'next/server';
import type { SessionUser } from '@/types/crm';

const COOKIE = 'valeris_session';

export async function POST(request: Request) {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    return NextResponse.json({ ok: false, error: 'Server configuration error' }, { status: 500 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.email || !body.password) {
    return NextResponse.json({ ok: false, error: 'Email and password are required' }, { status: 400 });
  }

  // Forward credentials to Apps Script — it handles hashing and session generation
  let asRes: Response;
  try {
    asRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'login', data: { email: body.email, password: body.password } }),
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Backend unreachable' }, { status: 502 });
  }

  const json = await asRes.json() as { ok: boolean; data?: SessionUser; error?: string };
  if (!json.ok || !json.data) {
    return NextResponse.json({ ok: false, error: json.error ?? 'Login failed' }, { status: 401 });
  }

  const session: SessionUser = json.data;
  const expiresAt = new Date(session.expiresAt);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
  return response;
}
