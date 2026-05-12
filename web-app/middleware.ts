import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccessPath } from '@/lib/rbac';
import { getDemoRole } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const role = getDemoRole(request.nextUrl.searchParams.get('role'));
  const pathname = request.nextUrl.pathname;

  if (!canAccessPath(role, pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/unauthorised';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/products/:path*', '/sessions/:path*', '/issues/:path*', '/reports/:path*'],
};
