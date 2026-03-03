# Cidade Sombra — MVP v6 (HUD + Noite Chuvosa)

- HUD fixo com barras de Cash, Energia, EXP e Exposição (cores por faixa).
- Tema “noite chuvosa”: fundo dark com overlay de chuva animada.
- Missões HOT dão +exposição mesmo no sucesso.
- Compras suspeitas sobem exposição conforme item.
- Tudo integrado ao balanço da v5 (prisão reduz exp, investimentos limpam exp).

## Rodar
```bash
npm install
cp .env.example .env.local
npx prisma migrate dev --name v6_hud_rainy_theme_exposure_hooks
npm run prisma:seed
npm run dev
# http://localhost:3000
```

## Deploy

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for Vercel and Docker deployment instructions.


## Conteúdo desta versão

- 100+ missões procedurais em `/api/missions/generate`.
- Sistema de investimentos em `/api/investments/*` e página `/investments`.
- Loja e itens em `/api/items/*` e página `/shop`.
- Inventário e equipar itens em `/api/inventory` e página `/inventory`.
- Models Prisma adicionados em `prisma/schema.prisma`: `Investment`, `UserInvestment`, `Item`, `UserItem`, `ShopItem`, `Category` (além de `Mission` expandida).
