import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { SessionUser } from '@/types/crm';

const COOKIE = 'valeris_session';

// Routes that never require authentication
const PUBLIC_PREFIXES = ['/login', '/api/login', '/_next', '/fonts', '/favicon'];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

function sessionValid(raw: string | undefined): boolean {
  if (!raw) return false;
  try {
    const session = JSON.parse(raw) as SessionUser;
    return !!session.token && new Date(session.expiresAt) > new Date();
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const raw = request.cookies.get(COOKIE)?.value;
  if (!sessionValid(raw)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|fonts/|.*\\.(?:svg|png|jpg|jpeg|webp|woff2)$).*)',
  ],
};
