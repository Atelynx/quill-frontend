# Validacion frontend-backend con mercado real

## Fecha de validacion

13 de mayo de 2026.

## Configuracion usada


Backend:

- `MARKET_PROVIDER=eodhd`
- `EODHD_API_KEY`
- `EODHD_SYMBOLS` con 8 simbolos del mercado chileno.
- `MARKET_FETCH_ON_STARTUP` 
- `MONGODB_URI` 
- `REDIS_URL` 
- `JWT_SECRET`
- `JWT_EXPIRES_IN=1d`

Frontend:

- `VITE_API_URL=http://localhost:3000/api`
- `VITE_SOCKET_URL=http://localhost:3000`
- `VITE_USE_STUBS=false`
- `VITE_API_BASE_URL` 

## Comandos ejecutados en backend

- `npm.cmd ci`: correcto. Reinstalo dependencias y resolvio el paquete `eodhd`; npm reporto 16 vulnerabilidades.
- `npm.cmd run build`: correcto.
- `npm.cmd run test:e2e`: correcto, 2 suites y 5 tests pasaron.
- `npm.cmd test -- --runInBand`: falla 1 test unitario existente en `market.service.spec.ts` porque el mock de `marketRefreshService` no expone `refreshMarket`.
- `node dist/main.js`: el backend inicia correctamente y registra rutas bajo `/api`.


## Comandos ejecutados en frontend

- `npm.cmd ci`: correcto. npm reporto 13 vulnerabilidades.
- `npm.cmd install --save-dev jsdom`: correcto, necesario para que las pruebas React usen DOM en Vitest.
- `npm.cmd run build`: correcto.
- `npm.cmd run test:run`: correcto, 4 suites y 7 tests pasaron.
- `npm.cmd run lint`: correcto con 5 warnings existentes, sin errores.


## Endpoints backend probados

- `GET /api/system/health`: 200, `mongodb=up`, `redis=up`.
- `GET /api/swagger`: 200.
- `POST /api/auth/register`: 201 con usuario de prueba.
- `POST /api/auth/login`: 201 con token JWT recibido, sin exponerlo.
- `GET /api/users/me`: 200 autenticado.
- `GET /api/market/stocks`: 200, 8 simbolos con `source=eodhd`.
- `GET /api/market/stocks/:symbol/history?limit=5`: 200, historial disponible.
- `GET /api/portfolio/summary`: 200 autenticado.
- `GET /api/orders?status=PENDING`: 200 autenticado.
- `GET /api/trades?limit=8`: 200 autenticado.
- `POST /api/orders`: 201 despues del ajuste de longitud de simbolo.

## Flujo probado

Usuario de prueba API/UI:

- `qa.real.market.1778704142694@quill.local`
- `qa.ui.1778705223653@quill.local`

Resultado:

- Registro y login: correctos.
- Dashboard por flujo equivalente API: correcto para autenticacion, mercado, portafolio, ordenes y trades.
- Mercado real: correcto, 8 simbolos EODHD.
- Portafolio inicial: `availableBalance=100000`, sin posiciones.
- Orden limitada: compra de 1 `BSANTANDER.SN` con precio limite `35.23`.
- Estado posterior: orden quedo `PENDING`, sin trade asociado.
- Portafolio posterior: saldo disponible bajo a `99964.59` y saldo reservado subio a `35.41`.


## Cambios aplicados

Backend:

- `src/modules/orders/presentation/dto/create-order.dto.ts`: amplia `@Length(1, 10)` a `@Length(1, 20)` para aceptar simbolos EODHD reales.

Frontend:

- `src/shared/api/validators/market.ts`: normaliza `currentPrice` heredado a `close`.
- `src/app/dashboard/DashboardPage.tsx`: alinea actualizaciones Socket.IO con cache keys actuales.
- `src/shared/api/hooks/queries.ts`: elimina `onError` incompatible con la version instalada de React Query.
- `src/shared/api/hooks/mutations.ts`, `src/app/dashboard/components/MarketChart.tsx`, `src/shared/components/ErrorBoundary.tsx`: ajustes de TypeScript para compilar.
- `vite.config.ts`, `vitest.config.ts`, `src/test/setup.ts`, `src/test/render.tsx`, `src/shared/theme/use-theme.spec.tsx`, `tsconfig.node.json`, `eslint.config.js`: configuracion minima para build, lint y tests actuales.
- `package.json` y `package-lock.json`: agrega `jsdom` como dependencia de desarrollo.

