'use client';
import { useEffect, useState } from 'react';
import { equipItemLocal, getEquippedBonuses, listInventoryLocal } from '../../src/lib/clientInventory';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [equippedLabel, setEquippedLabel] = useState('nenhum');

  function load() {
    setItems(listInventoryLocal());
    setEquippedLabel(getEquippedBonuses().label);
  }

  function equip(userItemId) {
    const json = equipItemLocal(userItemId);
    setMsg(json.ok ? `Equipado: ${json.equipped}` : json.message);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Inventory</h1>
      <p>Item equipado atual: <strong>{equippedLabel}</strong></p>
      {msg && <p>{msg}</p>}
      {!items.length && <p>Nenhum item ainda. Compre algo na loja.</p>}
      <ul>
        {items.map((it) => (
          <li key={it.id} style={{ marginBottom: 10 }}>
            <strong>{it.name}</strong> [{it.category}] — {it.bonus} {it.equipped ? '✅ equipado' : ''}
            {!it.equipped && <div><button onClick={() => equip(it.id)}>Equipar</button></div>}
          </li>
        ))}
      </ul>
    </main>
  );
}
