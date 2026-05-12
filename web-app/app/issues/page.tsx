import { AppNav } from '@/components/nav';

export default function IssuesPage() {
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

      <section className="card">
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
          <div><button type="button">Record issue</button></div>
        </form>
      </section>
    </main>
  );
}
