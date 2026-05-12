import { NextResponse } from 'next/server';
import { hasPermission } from '@/lib/auth';
import { getSessionFromRequest } from '@/lib/session';
import { createUser, listUsers, updateUser } from '@/lib/user-service';

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  if (!hasPermission(session.role, 'users.manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const users = await listUsers();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  if (!hasPermission(session.role, 'users.manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const user = await createUser(body);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  if (!hasPermission(session.role, 'users.manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const user = await updateUser(body);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}
