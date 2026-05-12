import { getCurrentSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  const session = await getCurrentSession();
  if (session) redirect('/dashboard');

  return (
    <main className="container" style={{ maxWidth: 520, paddingTop: 72 }}>
      <section className="card">
        <div className="badge">Login</div>
        <h1>Sign in</h1>
        <p className="subtle">Use your account email and password to access the stock system.</p>
        {searchParams?.error ? <div className="notice" style={{ marginBottom: 14 }}>{decodeURIComponent(searchParams.error)}</div> : null}
        <form className="form" action="/api/auth/login" method="post">
          <label>Email<input type="email" name="email" defaultValue="luasonda@gmail.com" placeholder="manager@diggers.local" required /></label>
          <label>Password<input type="password" name="password" placeholder="••••••••" required /></label>
          <button type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}
