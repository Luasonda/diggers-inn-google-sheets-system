"use client";

import { useState } from 'react';

type Props = {
  endpoint: string;
  title: string;
  description: string;
  payload: Record<string, unknown>;
};

export function LiveSaveForm({ endpoint, title, description, payload }: Props) {
  const [status, setStatus] = useState<string>('');

  async function handleSave() {
    setStatus('Saving...');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus(`Error: ${data.error ?? 'Save failed'}`);
      return;
    }

    setStatus(`Saved in ${data.mode} mode`);
  }

  return (
    <div className="card soft">
      <h2>{title}</h2>
      <p className="subtle">{description}</p>
      <button type="button" onClick={handleSave}>Test save</button>
      {status ? <p className="subtle" style={{ marginTop: 12 }}>{status}</p> : null}
    </div>
  );
}
