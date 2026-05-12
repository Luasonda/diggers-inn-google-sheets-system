import { AppNav } from '@/components/nav';
import { PermissionPanel } from '@/components/permission-panel';
import { getDemoRole } from '@/lib/auth';

const items = [
  { item: 'J&B Rare', mode: 'weighted liquor', openingBottles: 1, openingWeight: 447 },
  { item: 'Coca-Cola 500ml', mode: 'unit count', openingBottles: 26, openingWeight: null },
  { item: 'Mosi Lager', mode: 'full bottle', openingBottles: 18, openingWeight: null },
];

export default function OpeningCountPage({ searchParams }: { searchParams?: { role?: string } }) {
  const role = getDemoRole(searchParams?.role ?? null);

  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Opening count</div>
          <h1>Record opening stock</h1>
          <p className="subtle">Bartender-safe screen for starting the day with controlled stock entries.</p>
        </div>
        <AppNav />
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
        <PermissionPanel role={role} />
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
        <div style={{ marginTop: 16 }}><button type="button">Save opening count</button></div>
      </section>
    </main>
  );
}
