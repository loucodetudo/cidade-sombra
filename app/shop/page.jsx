'use client';
import { useEffect, useState } from 'react';
import { buyItemLocal, getPlayerState, getShopWithStock } from '../../src/lib/clientInventory';

export default function ShopPage() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [cash, setCash] = useState(0);

  function load() {
    setItems(getShopWithStock());
    setCash(getPlayerState().cash);
  }

  function buy(itemId) {
    const result = buyItemLocal(itemId);
    setMsg(result.ok ? `${result.message} (cash: R$ ${result.cash})` : result.message);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Shop</h1>
      <p>Cash disponível: <strong>R$ {cash}</strong></p>
      {msg && <p>{msg}</p>}
      <ul>
        {items.map((it) => (
          <li key={it.id} style={{ marginBottom: 10 }}>
            <strong>{it.name}</strong> [{it.category}] — bônus {it.bonus} — preço R$ {it.price} — estoque {it.stock}
            <div><button onClick={() => buy(it.id)}>Comprar</button></div>
          </li>
        ))}
      </ul>
    </main>
  );
}
