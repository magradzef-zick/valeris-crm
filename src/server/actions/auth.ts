'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/constants/cookie';
import { loginSchema } from '@/lib/validation/auth';
import type { SessionUser } from '@/types/crm';

// `redirectTo` is returned instead of calling redirect() so the cookie is
// included in the 200 action response. Calling redirect() in a Server Action
// that also sets a cookie causes Next.js to emit a 303 whose Set-Cookie header
// is dropped before the browser receives it — the session is then never stored.
export type AuthActionResult = { error: string } | { redirectTo: string } | undefined;

function safeRedirectPath(path: FormDataEntryValue | null): string {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
    return '/dashboard';
  }
  return path;
}

export async function signIn(
  _previous: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    return { error: 'Server configuration error. Contact your administrator.' };
  }

  let json: { ok: boolean; data?: SessionUser; error?: string };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'login',
        data: { email: parsed.data.email, password: parsed.data.password },
      }),
      signal: AbortSignal.timeout(15_000),
    });
    json = await res.json();
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'TimeoutError';
    return {
      error: isTimeout
        ? 'The authentication server took too long. Try again.'
        : 'Unable to reach the authentication server. Try again.',
    };
  }

  if (!json.ok || !json.data) {
    return { error: json.error ?? 'Incorrect email or password' };
  }

  const session = json.data;
  const expiresAt = new Date(session.expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return { redirectTo: safeRedirectPath(formData.get('redirect')) };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });
  redirect('/login');
}
