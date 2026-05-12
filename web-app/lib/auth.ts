export const ROLES = ['admin', 'manager', 'storekeeper', 'bartender'] as const;
export type Role = (typeof ROLES)[number];

export type Permission =
  | 'products.read'
  | 'products.write'
  | 'sessions.read'
  | 'sessions.write'
  | 'opening-count.write'
  | 'closing-count.write'
  | 'issues.write'
  | 'reports.read'
  | 'users.manage'
  | 'adjustments.write'
  | 'audit.read';

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'products.read', 'products.write', 'sessions.read', 'sessions.write',
    'opening-count.write', 'closing-count.write', 'issues.write', 'reports.read',
    'users.manage', 'adjustments.write', 'audit.read'
  ],
  manager: [
    'products.read', 'products.write', 'sessions.read', 'sessions.write',
    'opening-count.write', 'closing-count.write', 'issues.write', 'reports.read',
    'adjustments.write', 'audit.read'
  ],
  storekeeper: [
    'products.read', 'sessions.read', 'issues.write', 'reports.read'
  ],
  bartender: [
    'sessions.read', 'opening-count.write', 'issues.write', 'closing-count.write'
  ],
};

export function hasPermission(role: Role, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

export function getRolePermissions(role: Role) {
  return rolePermissions[role];
}

export function getDemoRole(searchParamsRole?: string | null): Role {
  if (searchParamsRole && ROLES.includes(searchParamsRole as Role)) {
    return searchParamsRole as Role;
  }
  return 'manager';
}
