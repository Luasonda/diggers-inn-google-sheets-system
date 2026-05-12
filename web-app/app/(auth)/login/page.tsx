export default function LoginPage() {
  return (
    <main className="container" style={{ maxWidth: 520, paddingTop: 72 }}>
      <section className="card">
        <div className="badge">Login</div>
        <h1>Sign in</h1>
        <p className="subtle">This is a placeholder for Supabase or NextAuth-based login.</p>
        <form className="form">
          <label>Email<input type="email" placeholder="manager@diggers.local" /></label>
          <label>Password<input type="password" placeholder="••••••••" /></label>
          <button type="button">Sign in</button>
        </form>
      </section>
    </main>
  );
}
