import { AppNav } from '@/components/nav';
import { LiveSaveForm } from '@/components/live-save-form';
import { PermissionPanel } from '@/components/permission-panel';
import { getDemoRole } from '@/lib/auth';

const items = [
  { item: 'J&B Rare', expectedShots: 21.9, closingBottles: 1, closingWeight: 1038, variance: 2.54 },
  { item: 'Coca-Cola 500ml', expectedShots: null, closingBottles: 18, closingWeight: null, variance: 0 },
  { item: 'Mosi Lager', expectedShots: null, closingBottles: 12, closingWeight: null, variance: -1 },
];

export default function ClosingCountPage({ searchParams }: { searchParams?: { role?: string } }) {
  const role = getDemoRole(searchParams?.role ?? null);

  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Closing count</div>
          <h1>Record closing stock</h1>
          <p className="subtle">End-of-day count with expected vs actual comparison and variance visibility.</p>
        </div>
        <AppNav />
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
        <PermissionPanel role={role} />
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

      <section style={{ marginTop: 16 }}>
        <LiveSaveForm
          endpoint="/api/closing-count"
          title="Backend save test"
          description="This sends a closing count through the validated API route. Once Supabase is configured, this route will upsert the closing entry into the database."
          payload={{
            sessionId: '11111111-1111-1111-1111-111111111111',
            productId: '22222222-2222-2222-2222-222222222222',
            closingFullBottles: 1,
            closingGrossWeightG: 1038,
            issuedQty: 1,
            notes: 'Closing count test',
          }}
        />
      </section>
    </main>
  );
}
