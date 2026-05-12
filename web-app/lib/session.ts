import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Permission, Role } from '@/lib/auth';
import { hasPermission } from '@/lib/auth';

export const SESSION_COOKIE = 'diggers_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

type SessionPayload = {
  userId: string;
  email: string;
  fullName: string;
  role: Role;
  exp: number;
};

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64url');
}

function getSessionSecret() {
  return process.env.SESSION_SECRET || 'dev-only-session-secret-change-me';
}

export function signSession(payload: Omit<SessionPayload, 'exp'>) {
  const body: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = base64url(JSON.stringify(body));
  const signature = crypto.createHmac('sha256', getSessionSecret()).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = crypto.createHmac('sha256', getSessionSecret()).update(encoded).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export function createSessionCookie(payload: Omit<SessionPayload, 'exp'>) {
  return signSession(payload);
}

export function getSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  return verifySessionToken(token ?? null);
}

export async function getCurrentSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireSession() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  return session;
}

export async function requirePermission(permission: Permission) {
  const session = await requireSession();
  if (!hasPermission(session.role, permission)) redirect('/unauthorised');
  return session;
}
