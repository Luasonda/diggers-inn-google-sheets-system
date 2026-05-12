import Link from 'next/link';

export default function UnauthorisedPage() {
  return (
    <main className="container" style={{ maxWidth: 720, paddingTop: 72 }}>
      <section className="card">
        <div className="badge">Access blocked</div>
        <h1>Unauthorised</h1>
        <p className="subtle">That role is not allowed to open this area. Bartenders should only handle opening counts, issuing, and closing counts.</p>
        <Link href="/dashboard" className="button">Back to dashboard</Link>
      </section>
    </main>
  );
}
