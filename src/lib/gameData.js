export const missionCategories = [
  'Trabalhos sujos',
  'Contrabando',
  'Golpes digitais',
  'Influência política',
  'Corrupção empresarial',
  'Crimes de rua',
  'Tramas policiais',
  'Missões VIP',
  'Lavagem',
  'Tráfico fictício',
];

const missionTemplates = [
  'Interceptar entrega de carga no porto',
  'Hackear servidor municipal',
  'Subornar delegado para apagar provas',
  'Desviar caminhão de eletrônicos',
  'Infiltrar contador em empresa rival',
  'Recuperar dossiê comprometedor',
  'Intermediar propina em gabinete',
  'Forjar contrato de fachada',
  'Desbloquear conta congelada no exterior',
  'Assumir rota paralela de distribuição',
];

const cityZones = ['Centro', 'Porto', 'Zona Norte', 'Distrito Industrial', 'Subúrbio', 'Prefeitura'];

export function generateMissions(total = 100) {
  return Array.from({ length: total }, (_, i) => {
    const tier = Math.floor(i / 20) + 1;
    const category = missionCategories[i % missionCategories.length];
    const risk = tier <= 2 ? 'baixo' : tier === 3 ? 'médio' : 'alto';
    const template = missionTemplates[i % missionTemplates.length];
    const zone = cityZones[i % cityZones.length];
    const successChance = Math.max(0.35, 0.9 - tier * 0.08 + (i % 5) * 0.01);
    const failurePenalty = 100 * tier + (i % 4) * 50;
    const energyCost = 8 + tier * 4 + (i % 3);
    const cooldownMin = 10 + tier * 5 + (i % 6) * 2;
    const rewardCash = 600 * tier + (i % 7) * 140;
    const rareItemChance = Math.min(0.3, 0.03 * tier + (i % 5) * 0.01);

    return {
      id: i + 1,
      title: `${template} — ${zone}`,
      description: `${category} em ${zone} com risco ${risk}.`,
      tier,
      risk,
      category,
      successChance: Number(successChance.toFixed(2)),
      failurePenalty,
      energyCost,
      cooldownMin,
      rewardCash,
      rareItemChance: Number(rareItemChance.toFixed(2)),
    };
  });
}

export const investmentsCatalog = [
  { id: 1, name: 'Oficina Clandestina', type: 'empresa', cost: 80000, yieldPerHour: 50, riskFactor: 'médio' },
  { id: 2, name: 'Apartamento no Centro', type: 'imóvel', cost: 150000, yieldPerHour: 83.33, riskFactor: 'baixo' },
  { id: 3, name: 'Dodge Preto', type: 'veículo', cost: 45000, yieldPerHour: 20.83, riskFactor: 'alto' },
  { id: 4, name: 'Ações da Megacorp', type: 'ação', cost: 200000, yieldPerHour: 100, riskFactor: 'médio' },
];

export const shopCatalog = [
  { id: 1, name: 'Jaqueta Blindada', category: 'roupa', price: 18000, stock: 15, bonus: '+8 defesa' },
  { id: 2, name: 'Pistola Fantasma', category: 'arma', price: 32000, stock: 8, bonus: '+10 força' },
  { id: 3, name: 'Relógio Criptografado', category: 'acessório', price: 12000, stock: 22, bonus: '+7 sorte' },
  { id: 4, name: 'Sedan Executivo', category: 'veículo', price: 90000, stock: 4, bonus: '+12 reputação' },
  { id: 5, name: 'Cobertura Anônima', category: 'imóvel', price: 230000, stock: 2, bonus: '+15 charme' },
  { id: 6, name: 'Kit Adrenalina', category: 'consumível', price: 4500, stock: 40, bonus: '+20 energia' },
];
