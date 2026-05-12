"use client";

import { useMemo, useState } from 'react';

const ROLES = ['admin', 'manager', 'storekeeper', 'bartender'] as const;

type UserRow = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  active: boolean;
  created_at?: string;
};

export function UserManagement({ initialUsers }: { initialUsers: UserRow[] }) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', role: 'bartender', password: '', active: true });
  const [editing, setEditing] = useState<Record<string, { role: string; active: boolean; fullName: string; password: string }>>({});

  const sortedUsers = useMemo(() => [...users], [users]);

  async function refreshUsers() {
    const response = await fetch('/api/users');
    const data = await response.json();
    if (response.ok) setUsers(data.users ?? []);
  }

  async function createNewUser() {
    setStatus('Creating user...');
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(`Error: ${data.error ?? 'Failed to create user'}`);
      return;
    }
    setForm({ fullName: '', email: '', role: 'bartender', password: '', active: true });
    setStatus('User created');
    await refreshUsers();
  }

  async function saveExistingUser(id: string) {
    const draft = editing[id];
    if (!draft) return;
    setStatus('Updating user...');
    const response = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        fullName: draft.fullName,
        role: draft.role,
        active: draft.active,
        password: draft.password || undefined,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(`Error: ${data.error ?? 'Failed to update user'}`);
      return;
    }
    setStatus('User updated');
    setEditing((prev) => ({ ...prev, [id]: { ...draft, password: '' } }));
    await refreshUsers();
  }

  return (
    <div className="grid cols-2">
      <section className="card">
        <h2>Add user</h2>
        <div className="form">
          <label>Name<input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{ROLES.map((role) => <option key={role}>{role}</option>)}</select></label>
          <label>Temporary password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          <label><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
          <button type="button" onClick={createNewUser}>Create user</button>
          {status ? <div className="subtle">{status}</div> : null}
        </div>
      </section>

      <section className="card">
        <h2>Existing users</h2>
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th>Action</th></tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => {
              const draft = editing[user.id] ?? { role: user.role, active: user.active, fullName: user.full_name, password: '' };
              return (
                <tr key={user.id}>
                  <td><input value={draft.fullName} onChange={(e) => setEditing((prev) => ({ ...prev, [user.id]: { ...draft, fullName: e.target.value } }))} /></td>
                  <td>{user.email}</td>
                  <td><select value={draft.role} onChange={(e) => setEditing((prev) => ({ ...prev, [user.id]: { ...draft, role: e.target.value } }))}>{ROLES.map((role) => <option key={role}>{role}</option>)}</select></td>
                  <td><input type="checkbox" checked={draft.active} onChange={(e) => setEditing((prev) => ({ ...prev, [user.id]: { ...draft, active: e.target.checked } }))} /></td>
                  <td>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <input type="password" placeholder="New password (optional)" value={draft.password} onChange={(e) => setEditing((prev) => ({ ...prev, [user.id]: { ...draft, password: e.target.value } }))} />
                      <button type="button" onClick={() => saveExistingUser(user.id)}>Save</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
