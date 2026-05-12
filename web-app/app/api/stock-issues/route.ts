import { NextResponse } from 'next/server';
import { hasPermission } from '@/lib/auth';
import { getSessionFromRequest } from '@/lib/session';
import { createStockIssue, getDemoRecentActivity } from '@/lib/stock-service';

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  if (!hasPermission(session.role, 'issues.write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return NextResponse.json(getDemoRecentActivity());
}

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    if (!hasPermission(session.role, 'issues.write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await request.json();
    const result = await createStockIssue(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}
