'use client';

import { useEffect, useMemo, useState } from 'react';
import { getEquippedBonuses } from '../src/lib/clientInventory';

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
  const [missions, setMissions] = useState([]);
  const [status, setStatus] = useState('');
  const [equipped, setEquipped] = useState({ label: 'nenhum', forca: 0, defesa: 0, sorte: 0, reputacao: 0, charme: 0, energia: 0 });

  const risco = useMemo(() => {
    if (game.exposicao < 30) return 'Baixo';
    if (game.exposicao < 70) return 'Médio';
    return 'Alto';
  }, [game.exposicao]);

  useEffect(() => {
    async function loadMissions() {
      const res = await fetch('/api/missions/generate');
      const json = await res.json();
      setMissions((json.missions ?? []).slice(0, 8));
    }
    loadMissions();
    setEquipped(getEquippedBonuses());
  }, []);

  const runMission = (mission) => {
    setGame((prev) => {
      const energiaCost = Math.max(1, mission.energyCost - Math.floor(equipped.energia / 4));
      if (prev.energia < energiaCost) {
        setStatus('Energia insuficiente para essa missão. Vá para Casa e descanse.');
        return prev;
      }

      const chanceBonus = equipped.sorte / 100;
      const successChance = clamp(mission.successChance + chanceBonus, 0.05, 0.98);
      const success = Math.random() <= successChance;

      const rewardBoost = 1 + equipped.forca / 100;
      const adjustedReward = Math.floor(mission.rewardCash * rewardBoost);
      const penaltyReduction = clamp(equipped.defesa / 100, 0, 0.6);
      const adjustedPenalty = Math.floor(mission.failurePenalty * (1 - penaltyReduction));
      const exposureReduction = Math.floor(equipped.reputacao / 4);
      const extraExp = Math.floor(equipped.charme / 2);

      const next = {
        ...prev,
        turn: prev.turn + 1,
        energia: clamp(prev.energia - energiaCost, 0, 100),
        cash: prev.cash + (success ? adjustedReward : -adjustedPenalty),
        exp: prev.exp + (success ? mission.tier * 8 + extraExp : mission.tier * 2),
        exposicao: clamp(prev.exposicao + (success ? mission.tier * 4 : mission.tier * 8) - exposureReduction, 0, 100),
      };

      setStatus(
        success
          ? `✅ Missão concluída: +R$ ${adjustedReward} (item: ${equipped.label})`
          : `❌ Missão falhou: -R$ ${adjustedPenalty} (item: ${equipped.label})`,
      );
      return next;
    });
  };

  const goHomeAndRest = () => {
    setGame((prev) => {
      const recovered = 30 + equipped.energia;
      const nextEnergy = clamp(prev.energia + recovered, 0, 100);
      setStatus(`🏠 Casa: descanso concluído. Energia +${nextEnergy - prev.energia}.`);
      return {
        ...prev,
        turn: prev.turn + 1,
        energia: nextEnergy,
      };
    });
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <section
        style={{
          width: 'min(980px, 100%)',
          background: 'linear-gradient(180deg, #12192a, #0b1020)',
          border: '1px solid #29354f',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,.45)',
        }}
      >
        <h1 style={{ marginTop: 0 }}>Cidade Sombra</h1>
        <p style={{ opacity: 0.85 }}>Missões disponíveis na tela inicial e botão Casa para descansar.</p>

        <nav style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <a href="/missions" style={{ color: '#9fc1ff' }}>Missões</a>
          <a href="/investments" style={{ color: '#9fc1ff' }}>Investments</a>
          <a href="/shop" style={{ color: '#9fc1ff' }}>Shop</a>
          <a href="/inventory" style={{ color: '#9fc1ff' }}>Inventory</a>
        </nav>

        <p style={{ opacity: 0.75, marginBottom: 4 }}>Item equipado: <strong>{equipped.label}</strong></p>
        <p style={{ opacity: 0.65, fontSize: 13, marginTop: 0 }}>
          Bônus aplicados: força +{equipped.forca}, defesa +{equipped.defesa}, sorte +{equipped.sorte}, reputação +{equipped.reputacao}, charme +{equipped.charme}, energia +{equipped.energia}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 12, marginTop: 20 }}>
          <Card label="Turno" value={String(game.turn)} />
          <Card label="Cash" value={`R$ ${game.cash}`} />
          <Card label="Energia" value={`${game.energia}%`} />
          <Card label="EXP" value={String(game.exp)} />
          <Card label="Exposição" value={`${game.exposicao}%`} />
          <Card label="Risco" value={risco} />
        </div>

        <div style={{ marginTop: 14 }}>
          <button
            type="button"
            onClick={goHomeAndRest}
            style={{
              border: '1px solid #4a5f92',
              background: '#223358',
              color: '#f5f7ff',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
            }}
          >
            Casa (descansar)
          </button>
        </div>

        {status && <p style={{ marginTop: 16 }}>{status}</p>}

        <h2 style={{ marginTop: 18, marginBottom: 10 }}>Missões criadas</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {missions.map((mission) => (
            <div key={mission.id} style={{ border: '1px solid #2c3b5e', borderRadius: 10, padding: 12, background: '#121c33' }}>
              <div style={{ fontWeight: 700 }}>{mission.title}</div>
              <div style={{ opacity: 0.85, fontSize: 13 }}>{mission.category} • Tier {mission.tier} • Risco {mission.risk}</div>
              <div style={{ opacity: 0.85, fontSize: 13 }}>
                Energia {mission.energyCost} • Cooldown {mission.cooldownMin} min • Recompensa R$ {mission.rewardCash}
              </div>
              <button
                type="button"
                onClick={() => runMission(mission)}
                style={{
                  marginTop: 8,
                  border: '1px solid #4a5f92',
                  background: '#223358',
                  color: '#f5f7ff',
                  borderRadius: 10,
                  padding: '8px 12px',
                  cursor: 'pointer',
                }}
              >
                Executar missão
              </button>
            </div>
          ))}
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
