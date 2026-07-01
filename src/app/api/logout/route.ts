import { NextResponse } from 'next/server';

const COOKIE = 'valeris_session';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });
  return response;
}
