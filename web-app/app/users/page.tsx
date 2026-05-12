import { HeaderUser } from '@/components/header-user';
import { AppNav } from '@/components/nav';
import { UserManagement } from '@/components/user-management';
import { requirePermission } from '@/lib/session';
import { listUsers } from '@/lib/user-service';

export default async function UsersPage() {
  await requirePermission('users.manage');
  const users = await listUsers();

  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Users</div>
          <h1>User management</h1>
          <p className="subtle">Create users, assign designations, and control who can access what.</p>
        </div>
        <div style={{ display: 'grid', gap: 10, justifyItems: 'end' }}>
          <HeaderUser />
          <AppNav />
        </div>
      </div>
      <UserManagement initialUsers={users} />
    </main>
  );
}
