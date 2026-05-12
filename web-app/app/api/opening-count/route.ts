import { NextResponse } from 'next/server';
import { createOpeningCount } from '@/lib/stock-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createOpeningCount(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}
