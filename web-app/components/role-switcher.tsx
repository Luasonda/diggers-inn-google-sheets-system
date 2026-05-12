import Link from 'next/link';
import { ROLES, type Role } from '@/lib/auth';

export function RoleSwitcher({ currentRole }: { currentRole: Role }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {ROLES.map((role) => (
        <Link
          key={role}
          href={`?role=${role}`}
          className="button secondary"
          style={{ opacity: currentRole === role ? 1 : 0.7 }}
        >
          {role}
        </Link>
      ))}
    </div>
  );
}
