import { NextResponse } from 'next/server';
import { hasPermission } from '@/lib/auth';
import { getSessionFromRequest } from '@/lib/session';
import { createClosingCount } from '@/lib/stock-service';

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    if (!hasPermission(session.role, 'closing-count.write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await request.json();
    const result = await createClosingCount(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}
