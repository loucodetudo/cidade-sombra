import { shopCatalog } from './gameData';

const STORAGE_KEY = 'cidade-sombra-player-v1';

const initialState = {
  cash: 300000,
  inventory: [],
  equippedItemId: null,
  shopStock: shopCatalog.map((it) => ({ id: it.id, stock: it.stock })),
};

function inBrowser() {
  return typeof window !== 'undefined';
}

function loadState() {
  if (!inBrowser()) return structuredClone(initialState);
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(initialState);
  const parsed = JSON.parse(raw);
  return {
    ...structuredClone(initialState),
    ...parsed,
  };
}

function saveState(state) {
  if (!inBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getPlayerState() {
  return loadState();
}

export function getShopWithStock() {
  const state = loadState();
  return shopCatalog.map((item) => {
    const row = state.shopStock.find((x) => x.id === item.id);
    return {
      ...item,
      stock: row ? row.stock : item.stock,
    };
  });
}

export function buyItemLocal(itemId) {
  const state = loadState();
  const item = shopCatalog.find((x) => x.id === Number(itemId));
  if (!item) return { ok: false, message: 'Item não encontrado.' };

  const stockRow = state.shopStock.find((x) => x.id === item.id);
  if (!stockRow || stockRow.stock <= 0) return { ok: false, message: 'Sem estoque.' };
  if (state.cash < item.price) return { ok: false, message: 'Cash insuficiente.' };

  state.cash -= item.price;
  stockRow.stock -= 1;

  state.inventory.push({
    id: Date.now() + Math.floor(Math.random() * 1000),
    itemId: item.id,
    name: item.name,
    category: item.category,
    bonus: item.bonus,
    equipped: false,
    acquiredAt: new Date().toISOString(),
  });

  saveState(state);
  return { ok: true, message: 'Compra realizada.', cash: state.cash };
}

export function listInventoryLocal() {
  const state = loadState();
  return state.inventory.map((it) => ({
    ...it,
    equipped: it.id === state.equippedItemId,
  }));
}

export function equipItemLocal(userItemId) {
  const state = loadState();
  const found = state.inventory.find((i) => i.id === Number(userItemId));
  if (!found) return { ok: false, message: 'Item no inventário não encontrado.' };
  state.equippedItemId = found.id;
  saveState(state);
  return { ok: true, equipped: found.name };
}

export function getEquippedBonuses() {
  const state = loadState();
  const found = state.inventory.find((i) => i.id === state.equippedItemId);
  if (!found) {
    return { label: 'nenhum', forca: 0, defesa: 0, sorte: 0, reputacao: 0, charme: 0, energia: 0 };
  }

  const match = found.bonus.match(/\+(\d+)\s*(\w+)/i);
  const value = match ? Number(match[1]) : 0;
  const stat = (match ? match[2] : '').toLowerCase();

  const bonus = { label: found.name, forca: 0, defesa: 0, sorte: 0, reputacao: 0, charme: 0, energia: 0 };
  if (stat.includes('for')) bonus.forca = value;
  if (stat.includes('def')) bonus.defesa = value;
  if (stat.includes('sort')) bonus.sorte = value;
  if (stat.includes('reputa')) bonus.reputacao = value;
  if (stat.includes('char')) bonus.charme = value;
  if (stat.includes('energ')) bonus.energia = value;
  return bonus;
}

