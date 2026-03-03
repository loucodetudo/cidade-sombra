'use client';
import { useEffect, useState } from 'react';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await fetch('/api/inventory');
    const json = await res.json();
    setItems(json.inventory ?? []);
  }

  async function equip(userItemId) {
    const res = await fetch('/api/items/equip', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userItemId }),
    });
    const json = await res.json();
    setMsg(json.ok ? `Equipado: ${json.equipped}` : json.message);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Inventory</h1>
      {msg && <p>{msg}</p>}
      {!items.length && <p>Nenhum item ainda. Compre algo na loja.</p>}
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <strong>{it.name}</strong> [{it.category}] — {it.bonus} {it.equipped ? '✅ equipado' : ''}
            {!it.equipped && <div><button onClick={() => equip(it.id)}>Equipar</button></div>}
          </li>
        ))}
      </ul>
    </main>
  );
}
