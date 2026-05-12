import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Diggers Bar & Restaurant</div>
          <h1>Stock control web app MVP</h1>
          <p className="subtle">Replacing the Excel workflow with controlled forms, role-based access, and cleaner reporting.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/dashboard" className="button">Open dashboard</Link>
          <Link href="/sessions/opening?role=bartender" className="button secondary">Test bartender flow</Link>
          <Link href="/setup" className="button secondary">Backend setup</Link>
        </div>
      </div>

      <div className="grid cols-2">
        <section className="card">
          <h2>What this scaffold includes</h2>
          <ul className="list">
            <li>Next.js app structure</li>
            <li>Dashboard and module placeholders</li>
            <li>Role-based route guard scaffolding</li>
            <li>Opening and closing stock count screens</li>
            <li>Session, issue, and stock workflow foundations</li>
            <li>Supabase-ready API routes for saving real data</li>
          </ul>
        </section>
        <section className="card soft">
          <h2>Non-negotiable role rule</h2>
          <div className="role-box">
            Bartenders are limited to <strong>opening stock count</strong>, <strong>issuing</strong>, and <strong>closing stock count</strong> only.
          </div>
        </section>
      </div>
    </main>
  );
}
