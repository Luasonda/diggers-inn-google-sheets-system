import { AppNav } from '@/components/nav';

export default function ReportsPage() {
  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Reports</div>
          <h1>Variance and movement reports</h1>
          <p className="subtle">Manager-only reporting area for variances, low stock, and daily movement.</p>
        </div>
        <AppNav />
      </div>

      <section className="grid cols-2">
        <article className="card">
          <h2>MVP report set</h2>
          <ul className="list">
            <li>Daily variance report</li>
            <li>Issues by date and item</li>
            <li>Low-stock report</li>
            <li>Liquor depletion report</li>
          </ul>
        </article>
        <article className="card soft">
          <h2>Next build step</h2>
          <p className="subtle">Wire these views to a real database, auth, and stock-calculation services.</p>
        </article>
      </section>
    </main>
  );
}
