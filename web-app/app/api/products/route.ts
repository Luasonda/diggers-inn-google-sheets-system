import { NextResponse } from 'next/server';
import { hasPermission } from '@/lib/auth';
import { getSessionFromRequest } from '@/lib/session';
import { createProduct, deactivateProduct, listProductsDetailed, updateProduct } from '@/lib/product-service';

function guard(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  if (!hasPermission(session.role, 'products.write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

export async function GET(request: Request) {
  const blocked = guard(request);
  if (blocked) return blocked;
  try {
    const products = await listProductsDetailed();
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const blocked = guard(request);
  if (blocked) return blocked;
  try {
    const body = await request.json();
    const product = await createProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const blocked = guard(request);
  if (blocked) return blocked;
  try {
    const body = await request.json();
    const product = await updateProduct(body);
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const blocked = guard(request);
  if (blocked) return blocked;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    const product = await deactivateProduct(id);
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}
