import { publicEnv } from '@/lib/env';

export default function SetupPage() {
  const supabaseReady = Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <main className="container">
      <div className="badge">Setup</div>
      <h1>Backend setup status</h1>
      <div className="grid cols-2">
        <section className="card">
          <h2>Supabase environment</h2>
          <ul className="list">
            <li>URL configured: {publicEnv.NEXT_PUBLIC_SUPABASE_URL ? 'Yes' : 'No'}</li>
            <li>Anon key configured: {publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</li>
            <li>Frontend connection ready: {supabaseReady ? 'Yes' : 'No'}</li>
          </ul>
        </section>
        <section className="card soft">
          <h2>Next steps</h2>
          <ol className="list">
            <li>Create a Supabase project</li>
            <li>Run <code>db/schema.sql</code></li>
            <li>Add Vercel environment variables</li>
            <li>Redeploy the app</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
