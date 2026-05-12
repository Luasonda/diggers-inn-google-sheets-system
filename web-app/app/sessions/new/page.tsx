import { AppNav } from '@/components/nav';

export default function NewSessionPage() {
  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">New session</div>
          <h1>Open daily stock session</h1>
          <p className="subtle">This will later create the working container for opening, issue, and closing entries.</p>
        </div>
        <AppNav />
      </div>

      <section className="card">
        <form className="form">
          <div className="form-row">
            <label>Business date<input type="date" defaultValue="2026-05-12" /></label>
            <label>Bar / location<select defaultValue="Main Bar"><option>Main Bar</option><option>Garden Bar</option></select></label>
            <label>Session owner<select defaultValue="Bartender"><option>Bartender</option><option>Supervisor</option></select></label>
          </div>
          <div className="notice">Bartenders should only access the stock count and issuing screens tied to the active session.</div>
          <div><button type="button">Create session</button></div>
        </form>
      </section>
    </main>
  );
}
