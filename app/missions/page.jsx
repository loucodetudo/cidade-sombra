'use client';

import { useEffect, useState } from 'react';

export default function MissionsPage() {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/missions/generate');
      const json = await res.json();
      setMissions(json.missions ?? []);
    }
    load();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Missões</h1>
      <p>Total gerado: {missions.length}</p>
      <ul style={{ display: 'grid', gap: 10, padding: 0, listStyle: 'none' }}>
        {missions.slice(0, 30).map((m) => (
          <li key={m.id} style={{ border: '1px solid #2c3b5e', borderRadius: 10, padding: 12 }}>
            <strong>{m.title}</strong>
            <div>{m.category} • Tier {m.tier} • Risco {m.risk}</div>
            <div>Chance {Math.round(m.successChance * 100)}% • Penalidade R$ {m.failurePenalty}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
