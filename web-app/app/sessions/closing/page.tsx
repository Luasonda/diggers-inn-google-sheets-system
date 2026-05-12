import { AppNav } from '@/components/nav';
import { HeaderUser } from '@/components/header-user';
import { LiveSaveForm } from '@/components/live-save-form';
import { PermissionPanel } from '@/components/permission-panel';
import { getRecentCounts } from '@/lib/queries';
import { requirePermission } from '@/lib/session';

const items = [
  { item: 'J&B Rare', expectedShots: 21.9, closingBottles: 1, closingWeight: 1038, variance: 2.54 },
  { item: 'Coca-Cola 500ml', expectedShots: null, closingBottles: 18, closingWeight: null, variance: 0 },
  { item: 'Mosi Lager', expectedShots: null, closingBottles: 12, closingWeight: null, variance: -1 },
];

export default async function ClosingCountPage() {
  const session = await requirePermission('closing-count.write');
  const activity = await getRecentCounts();

  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Closing count</div>
          <h1>Record closing stock</h1>
          <p className="subtle">End-of-day count with expected vs actual comparison and variance visibility.</p>
        </div>
        <div style={{ display: 'grid', gap: 10, justifyItems: 'end' }}>
          <HeaderUser />
          <AppNav />
        </div>
      </div>

      <section className="grid cols-2">
        <article className="card">
          <h2>Close session</h2>
          <form className="form">
            <div className="form-row">
              <label>Business date<input type="date" defaultValue="2026-05-12" /></label>
              <label>Supervisor<select defaultValue="Manager"><option>Manager</option><option>Supervisor</option></select></label>
            </div>
            <div className="notice">Variances should be reviewed before the session is locked.</div>
          </form>
        </article>
        <PermissionPanel role={session.role} />
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>Closing line items</h2>
        <table className="table">
          <thead>
            <tr><th>Item</th><th>Expected closing</th><th>Closing full bottles / units</th><th>Closing gross weight (g)</th><th>Variance</th></tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.item}>
                <td>{row.item}</td>
                <td>{row.expectedShots === null ? 'Count-based' : `${row.expectedShots} shots`}</td>
                <td><input type="number" defaultValue={row.closingBottles} min="0" /></td>
                <td>{row.closingWeight === null ? '—' : <input type="number" defaultValue={row.closingWeight} min="0" />}</td>
                <td>{row.variance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid cols-2" style={{ marginTop: 16 }}>
        <LiveSaveForm
          endpoint="/api/closing-count"
          title="Backend save test"
          description="This sends a closing count through the validated API route and now upserts into Supabase in the live deployment."
          payload={{
            sessionId: '11111111-1111-1111-1111-111111111111',
            productId: '22222222-2222-2222-2222-222222222222',
            closingFullBottles: 1,
            closingGrossWeightG: 1038,
            issuedQty: 1,
            notes: 'Closing count test',
          }}
        />
        <article className="card">
          <h2>Recent closing counts</h2>
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Item</th><th>Units</th><th>Weight (g)</th></tr>
            </thead>
            <tbody>
              {activity.closingCounts.length ? activity.closingCounts.map((row: any) => (
                <tr key={row.id}>
                  <td>{row.businessDate ?? '—'}</td>
                  <td>{row.item}</td>
                  <td>{row.closingFullBottles ?? 0}</td>
                  <td>{row.closingGrossWeightG ?? 0}</td>
                </tr>
              )) : <tr><td colSpan={4}>No closing counts yet.</td></tr>}
            </tbody>
          </table>
        </article>
      </section>
    </main>
  );
}
