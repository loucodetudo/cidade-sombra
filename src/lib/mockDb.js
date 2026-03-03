import { investmentsCatalog, shopCatalog } from './gameData';

const db = {
  user: {
    id: 1,
    cash: 300000,
    equippedItems: [],
    inventory: [],
    investments: {},
    lastLoginAt: Date.now(),
  },
  shop: structuredClone(shopCatalog),
};

export function listInvestments() {
  return investmentsCatalog;
}

export function buyInvestment(investmentId) {
  const target = investmentsCatalog.find((i) => i.id === Number(investmentId));
  if (!target) return { ok: false, message: 'Investimento não encontrado.' };
  if (db.user.cash < target.cost) return { ok: false, message: 'Cash insuficiente.' };
  db.user.cash -= target.cost;
  const row = db.user.investments[target.id] ?? { quantity: 0, lastCollected: Date.now() };
  row.quantity += 1;
  db.user.investments[target.id] = row;
  return { ok: true, userCash: db.user.cash, investment: target, quantity: row.quantity };
}

export function collectInvestments() {
  const now = Date.now();
  let total = 0;
  Object.entries(db.user.investments).forEach(([id, row]) => {
    const inv = investmentsCatalog.find((x) => x.id === Number(id));
    if (!inv) return;
    const hours = (now - row.lastCollected) / 3600000;
    const gross = Math.max(0, hours * inv.yieldPerHour * row.quantity);
    const riskPenalty = inv.riskFactor === 'alto' ? 0.2 : inv.riskFactor === 'médio' ? 0.1 : 0.03;
    const net = gross * (1 - riskPenalty);
    total += net;
    row.lastCollected = now;
  });
  const rounded = Math.floor(total);
  db.user.cash += rounded;
  return { ok: true, collected: rounded, userCash: db.user.cash };
}

export function listShop() {
  return db.shop;
}

export function buyItem(itemId) {
  const target = db.shop.find((i) => i.id === Number(itemId));
  if (!target) return { ok: false, message: 'Item não encontrado.' };
  if (target.stock <= 0) return { ok: false, message: 'Sem estoque.' };
  if (db.user.cash < target.price) return { ok: false, message: 'Cash insuficiente.' };
  db.user.cash -= target.price;
  target.stock -= 1;
  db.user.inventory.push({ id: Date.now(), itemId: target.id, ...target, equipped: false, acquiredAt: new Date().toISOString() });
  return { ok: true, userCash: db.user.cash };
}

export function listInventory() {
  return db.user.inventory;
}

export function equipItem(userItemId) {
  const found = db.user.inventory.find((i) => i.id === Number(userItemId));
  if (!found) return { ok: false, message: 'Item no inventário não encontrado.' };
  db.user.inventory = db.user.inventory.map((i) => ({ ...i, equipped: i.id === found.id }));
  db.user.equippedItems = [found.name];
  return { ok: true, equipped: found.name };
}
