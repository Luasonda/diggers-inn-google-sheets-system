import type { Permission, Role } from '@/lib/auth';
import { hasPermission } from '@/lib/auth';

export type RouteGuard = {
  pathPrefix: string;
  permission: Permission;
};

export const routeGuards: RouteGuard[] = [
  { pathPrefix: '/products', permission: 'products.read' },
  { pathPrefix: '/sessions', permission: 'sessions.read' },
  { pathPrefix: '/issues', permission: 'issues.write' },
  { pathPrefix: '/reports', permission: 'reports.read' },
];

export function canAccessPath(role: Role, pathname: string) {
  const guard = routeGuards.find((item) => pathname.startsWith(item.pathPrefix));
  if (!guard) return true;
  return hasPermission(role, guard.permission);
}
