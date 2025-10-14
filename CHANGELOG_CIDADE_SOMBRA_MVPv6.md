# Changelog — patch automático (2025-10-06T14:25:29)
- Nova curva de **Exposição** por faixas e `computeJailChance` (anti soft-lock de cadeia).
- **Investimentos/collect**: janela mínima de 4h, **decay** se antecipar, **taxa 3%**.
- **Loja/buy**: imposto 2% (+3% se item **ilegal**); resposta inclui `totalPrice` e `tax`.
- **HUD**: `refreshInterval` adaptativo, rótulo textual de Exposição, fetcher centralizado.
- **API fetcher** central com redirecionamento 401.
- **Prisma**: índice `MissionRun(userId, ranAt)` para relatórios/telemetria.

Arquivos modificados/criados:
- src/domain/exposure.ts
- src/app/api/missions/perform/route.ts
- src/app/api/investments/collect/route.ts
- src/app/api/shop/buy/route.ts
- src/components/HUD.tsx
- src/lib/api.ts
- prisma/schema.prisma
