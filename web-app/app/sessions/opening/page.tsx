import { AppNav } from '@/components/nav';
import { HeaderUser } from '@/components/header-user';
import { LiveSaveForm } from '@/components/live-save-form';
import { PermissionPanel } from '@/components/permission-panel';
import { getRecentCounts } from '@/lib/queries';
import { requirePermission } from '@/lib/session';

const items = [
  { item: 'J&B Rare', mode: 'weighted liquor', openingBottles: 1, openingWeight: 447 },
  { item: 'Coca-Cola 500ml', mode: 'unit count', openingBottles: 26, openingWeight: null },
  { item: 'Mosi Lager', mode: 'full bottle', openingBottles: 18, openingWeight: null },
];

export default async function OpeningCountPage() {
  const session = await requirePermission('opening-count.write');
  const activity = await getRecentCounts();

  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Opening count</div>
          <h1>Record opening stock</h1>
          <p className="subtle">Bartender-safe screen for starting the day with controlled stock entries.</p>
        </div>
        <div style={{ display: 'grid', gap: 10, justifyItems: 'end' }}>
          <HeaderUser />
          <AppNav />
        </div>
      </div>

      <section className="grid cols-2">
        <article className="card">
          <h2>Session details</h2>
          <form className="form">
            <div className="form-row">
              <label>Business date<input type="date" defaultValue="2026-05-12" /></label>
              <label>Bar<select defaultValue="Main Bar"><option>Main Bar</option><option>Garden Bar</option></select></label>
            </div>
            <div className="notice">Only opening counts should be entered here. No product edits, no back-dated changes.</div>
          </form>
        </article>
        <PermissionPanel role={session.role} />
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>Opening line items</h2>
        <table className="table">
          <thead>
            <tr><th>Item</th><th>Count mode</th><th>Opening full bottles / units</th><th>Opening gross weight (g)</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.item}>
                <td>{row.item}</td>
                <td>{row.mode}</td>
                <td><input type="number" defaultValue={row.openingBottles} min="0" /></td>
                <td>{row.openingWeight === null ? '—' : <input type="number" defaultValue={row.openingWeight} min="0" />}</td>
                <td><input type="text" placeholder="Optional note" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid cols-2" style={{ marginTop: 16 }}>
        <LiveSaveForm
          endpoint="/api/opening-count"
          title="Backend save test"
          description="This hits the API route and now writes to Supabase in the live deployment."
          payload={{
            sessionId: '11111111-1111-1111-1111-111111111111',
            productId: '22222222-2222-2222-2222-222222222222',
            openingFullBottles: 1,
            openingGrossWeightG: 447,
            issuedQty: 0,
            notes: 'Opening count test',
          }}
        />
        <article className="card">
          <h2>Recent opening counts</h2>
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Item</th><th>Units</th><th>Weight (g)</th></tr>
            </thead>
            <tbody>
              {activity.openingCounts.length ? activity.openingCounts.map((row: any) => (
                <tr key={row.id}>
                  <td>{row.businessDate ?? '—'}</td>
                  <td>{row.item}</td>
                  <td>{row.openingFullBottles ?? 0}</td>
                  <td>{row.openingGrossWeightG ?? 0}</td>
                </tr>
              )) : <tr><td colSpan={4}>No opening counts yet.</td></tr>}
            </tbody>
          </table>
        </article>
      </section>
    </main>
  );
}
