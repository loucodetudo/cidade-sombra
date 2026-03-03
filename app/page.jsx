'use client';

import { useMemo, useState } from 'react';

const INITIAL = {
  cash: 100,
  energia: 100,
  exp: 0,
  exposicao: 0,
  turn: 1,
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function Page() {
  const [game, setGame] = useState(INITIAL);

  const risco = useMemo(() => {
    if (game.exposicao < 30) return 'Baixo';
    if (game.exposicao < 70) return 'Médio';
    return 'Alto';
  }, [game.exposicao]);

  const runAction = (kind) => {
    setGame((prev) => {
      if (kind === 'trabalho') {
        return {
          ...prev,
          turn: prev.turn + 1,
          energia: clamp(prev.energia - 10, 0, 100),
          cash: prev.cash + 30,
          exp: prev.exp + 5,
          exposicao: clamp(prev.exposicao + 4, 0, 100),
        };
      }

      if (kind === 'missao') {
        const success = Math.random() > prev.exposicao / 140;
        return {
          ...prev,
          turn: prev.turn + 1,
          energia: clamp(prev.energia - 20, 0, 100),
          cash: prev.cash + (success ? 80 : 10),
          exp: prev.exp + (success ? 15 : 4),
          exposicao: clamp(prev.exposicao + (success ? 12 : 20), 0, 100),
        };
      }

      return {
        ...prev,
        turn: prev.turn + 1,
        energia: clamp(prev.energia + 25, 0, 100),
        exposicao: clamp(prev.exposicao - 10, 0, 100),
      };
    });
  };

  const reset = () => setGame(INITIAL);

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <section
        style={{
          width: 'min(860px, 100%)',
          background: 'linear-gradient(180deg, #12192a, #0b1020)',
          border: '1px solid #29354f',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,.45)',
        }}
      >
        <h1 style={{ marginTop: 0 }}>Cidade Sombra</h1>
        <p style={{ opacity: 0.85 }}>Build mínimo para deploy contínuo no Vercel. Use como base para conectar suas APIs e persistência.</p>

        <nav style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <a href="/investments" style={{ color: '#9fc1ff' }}>Investments</a>
          <a href="/shop" style={{ color: '#9fc1ff' }}>Shop</a>
          <a href="/inventory" style={{ color: '#9fc1ff' }}>Inventory</a>
        </nav>
        <p style={{ fontSize: 13, opacity: 0.75 }}>Avatar: Sombra-01 • Outfit: Urbano Noturno • Equipados: jaqueta tática</p>


        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 12, marginTop: 20 }}>
          <Card label="Turno" value={String(game.turn)} />
          <Card label="Cash" value={`R$ ${game.cash}`} />
          <Card label="Energia" value={`${game.energia}%`} />
          <Card label="EXP" value={String(game.exp)} />
          <Card label="Exposição" value={`${game.exposicao}%`} />
          <Card label="Risco" value={risco} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
          <ActionButton onClick={() => runAction('trabalho')}>Trabalho Rápido</ActionButton>
          <ActionButton onClick={() => runAction('missao')}>Missão HOT</ActionButton>
          <ActionButton onClick={() => runAction('descanso')}>Descansar</ActionButton>
          <ActionButton onClick={reset}>Novo Jogo</ActionButton>
        </div>
      </section>
    </main>
  );
}

function Card({ label, value }) {
  return (
    <div style={{ border: '1px solid #2c3b5e', borderRadius: 12, padding: 14, background: '#121c33' }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
      <strong style={{ fontSize: 24 }}>{value}</strong>
    </div>
  );
}

function ActionButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: '1px solid #4a5f92',
        background: '#223358',
        color: '#f5f7ff',
        borderRadius: 10,
        padding: '10px 14px',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
