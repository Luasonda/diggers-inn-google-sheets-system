import { AppNav } from '@/components/nav';
import { LiveSaveForm } from '@/components/live-save-form';
import { PermissionPanel } from '@/components/permission-panel';
import { getDemoRole } from '@/lib/auth';

export default function IssuesPage({ searchParams }: { searchParams?: { role?: string } }) {
  const role = getDemoRole(searchParams?.role ?? null);
  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Stock issues</div>
          <h1>Issue stock to bar</h1>
          <p className="subtle">Storekeeper or authorised staff record stock issued into the active session.</p>
        </div>
        <AppNav />
      </div>

      <section className="grid cols-2">
        <article className="card">
          <form className="form">
            <div className="form-row">
              <label>Date<input type="date" defaultValue="2026-05-12" /></label>
              <label>Item<select><option>J&B Rare</option><option>Coca-Cola 500ml</option><option>Mosi Lager</option></select></label>
              <label>Quantity<input type="number" min="0" defaultValue="1" /></label>
            </div>
            <div className="form-row">
              <label>Issued by<input type="text" defaultValue="Storekeeper" /></label>
              <label>Received by<input type="text" defaultValue="Bartender" /></label>
              <label>Notes<textarea rows={1} defaultValue="Morning issue" /></label>
            </div>
          </form>
        </article>
        <PermissionPanel role={role} />
      </section>

      <section style={{ marginTop: 16 }}>
        <LiveSaveForm
          endpoint="/api/stock-issues"
          title="Backend save test"
          description="This creates a stock issue via the API. It runs in demo mode until Supabase environment variables are added."
          payload={{
            sessionId: '11111111-1111-1111-1111-111111111111',
            productId: '22222222-2222-2222-2222-222222222222',
            quantity: 1,
            issueDate: '2026-05-12',
            issuedByUserId: '33333333-3333-3333-3333-333333333333',
            receivedByUserId: '44444444-4444-4444-4444-444444444444',
            notes: 'Morning issue',
          }}
        />
      </section>
    </main>
  );
}
