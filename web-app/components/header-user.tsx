import { getCurrentSession } from '@/lib/session';

export async function HeaderUser() {
  const session = await getCurrentSession();
  if (!session) return null;

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <span className="badge">{session.role}</span>
      <span className="subtle">{session.fullName}</span>
      <form action="/api/auth/logout" method="post">
        <button type="submit" className="button secondary">Log out</button>
      </form>
    </div>
  );
}
