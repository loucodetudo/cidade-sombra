'use client';
import { useEffect, useState } from 'react';

export default function InvestmentsPage() {
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await fetch('/api/investments/list');
    const json = await res.json();
    setData(json.investments ?? []);
  }

  async function buy(investmentId) {
    const res = await fetch('/api/investments/buy', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ investmentId }),
    });
    const json = await res.json();
    setMsg(json.ok ? 'Investimento comprado com sucesso.' : json.message);
  }

  async function collect() {
    const res = await fetch('/api/investments/collect', { method: 'POST' });
    const json = await res.json();
    setMsg(`Coletado: R$ ${json.collected}`);
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Investments</h1>
      <button onClick={collect}>Coletar rendimentos offline</button>
      {msg && <p>{msg}</p>}
      <ul>
        {data.map((it) => (
          <li key={it.id} style={{ marginBottom: 12 }}>
            <strong>{it.name}</strong> ({it.type}) — custo R$ {it.cost} — lucro/h {it.yieldPerHour} — risco {it.riskFactor}
            <div><button onClick={() => buy(it.id)}>Comprar</button></div>
          </li>
        ))}
      </ul>
    </main>
  );
}
