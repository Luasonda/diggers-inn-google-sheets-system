import { getRolePermissions, type Role } from '@/lib/auth';

export function PermissionPanel({ role }: { role: Role }) {
  const permissions = getRolePermissions(role);

  return (
    <section className="card soft">
      <h2>Active role: {role}</h2>
      <ul className="list">
        {permissions.map((permission) => (
          <li key={permission}>{permission}</li>
        ))}
      </ul>
    </section>
  );
}
