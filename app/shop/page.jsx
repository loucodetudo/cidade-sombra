'use client';
import { useEffect, useState } from 'react';

export default function ShopPage() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await fetch('/api/items/shop');
    const json = await res.json();
    setItems(json.items ?? []);
  }

  async function buy(itemId) {
    const res = await fetch('/api/items/buy', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ itemId }),
    });
    const json = await res.json();
    setMsg(json.ok ? 'Compra realizada.' : json.message);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Shop</h1>
      {msg && <p>{msg}</p>}
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <strong>{it.name}</strong> [{it.category}] — bônus {it.bonus} — preço R$ {it.price} — estoque {it.stock}
            <div><button onClick={() => buy(it.id)}>Comprar</button></div>
          </li>
        ))}
      </ul>
    </main>
  );
}
