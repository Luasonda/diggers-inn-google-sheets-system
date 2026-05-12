import { AppNav } from '@/components/nav';
import { PermissionPanel } from '@/components/permission-panel';
import { RoleSwitcher } from '@/components/role-switcher';
import { getDemoRole } from '@/lib/auth';
import { bartenderPermissions } from '@/lib/mock-data';
import { getDashboardSummary } from '@/lib/queries';

export default async function DashboardPage({ searchParams }: { searchParams?: { role?: string } }) {
  const role = getDemoRole(searchParams?.role ?? null);
  const summary = await getDashboardSummary();
  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Dashboard</div>
          <h1>Diggers stock control</h1>
          <p className="subtle">Operational snapshot for managers and supervisors.</p>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          <RoleSwitcher currentRole={role} />
          <AppNav />
        </div>
      </div>

      <section className="grid cols-4">
        {summary.kpis.map((item) => (
          <article key={item.label} className="card">
            <div className="subtle">{item.label}</div>
            <div className="kpi">{item.value}</div>
            <div className="subtle">{item.note}</div>
          </article>
        ))}
      </section>

      <section className="grid cols-2" style={{ marginTop: 16 }}>
        <article className="card">
          <h2>Low stock</h2>
          <table className="table">
            <thead>
              <tr><th>Item</th><th>Category</th><th>Status</th><th>Balance</th></tr>
            </thead>
            <tbody>
              {summary.lowStock.map((row) => (
                <tr key={row.item}>
                  <td>{row.item}</td>
                  <td>{row.category}</td>
                  <td>{row.status}</td>
                  <td>{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="card soft">
          <h2>Bartender access scope</h2>
          <ul className="list">
            {bartenderPermissions.map((permission) => <li key={permission}>{permission}</li>)}
          </ul>
          <div className="notice" style={{ marginTop: 12 }}>
            Everything else — products, reports configuration, user management, historic edits, and adjustments — stays restricted.
          </div>
        </article>
      </section>

      <section style={{ marginTop: 16 }}>
        <PermissionPanel role={role} />
      </section>
    </main>
  );
}
