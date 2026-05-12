import Link from 'next/link';
import { AppNav } from '@/components/nav';
import { sessions } from '@/lib/mock-data';

export default function SessionsPage() {
  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Daily sessions</div>
          <h1>Stock sessions</h1>
          <p className="subtle">One stock-control session per business day.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <AppNav />
          <Link href="/sessions/new" className="button">New session</Link>
        </div>
      </div>
      <section className="card">
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Bar</th><th>Status</th><th>Opened by</th><th>Closed by</th></tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={`${session.date}-${session.bar}`}>
                <td>{session.date}</td>
                <td>{session.bar}</td>
                <td>{session.status}</td>
                <td>{session.openedBy}</td>
                <td>{session.closedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
