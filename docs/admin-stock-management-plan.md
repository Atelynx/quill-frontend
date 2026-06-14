# Admin Stock Management — Frontend Plan

Date: 2026-06-14

## Overview

Admin UI to manage stocks independently of the active market data provider. Based on backend API changelog for admin stock endpoints.

---

## Backend API Reference

### `GET /admin/stocks`
List stocks with `?search=`, `?source=`, `?page=`, `?limit=` filtering. Returns `{ data: AdminStock[], meta: { total, page, limit, totalPages } }`.

### `POST /admin/stocks`
Create stock with `{ symbol, name, currency?, close, baseVolatility?, baseDrift? }`. Returns created stock with `source: "admin"`.

### `PATCH /admin/stocks/:symbol/price`
Update price with `{ price: number }`. Returns updated stock. Source is never changed. Toast warns about provider refresh overwrite.

### `DELETE /admin/stocks/:symbol`
Delete admin-created stock (`source === "admin"`). Returns `{ message }`. 403 for provider-managed stocks.

---

## Implementation Order

### Step 1 — Foundation: Validators, API Service, Stubs, Hooks, Strings

New files:
- `src/shared/api/validators/stocks.ts`
- `src/shared/api/stub-data.ts` (extend)

Modified files:
- `src/shared/api/validators/index.ts`
- `src/shared/api/real-api-service.ts`
- `src/shared/api/stubbed-api-service.ts`
- `src/shared/api/api-service.ts`
- `src/shared/api/hooks/queries.ts`
- `src/shared/api/hooks/mutations.ts`
- `src/shared/content/strings.ts`

### Step 2 — Admin Stocks List Page

New files:
- `src/app/admin/pages/AdminStocksPage.tsx`

Features:
- Search input for symbol/name
- Source filter pills (All / Admin / Mock / EODHD)
- Table with Symbol, Name, Price, Day Change %, Source badge, Actions
- Pagination
- Loading + empty states

### Step 3 — Create Stock Modal

New files:
- `src/app/admin/components/AdminStockCreateModal.tsx`

Fields: symbol, name, currency, close, baseVolatility, baseDrift

### Step 4 — Price Update Modal

New files:
- `src/app/admin/components/AdminStockPriceModal.tsx`

Single field (price) + toast warning about refresh overwrite.

### Step 5 — Delete Stock (inline dialog)

Inline in AdminStocksPage. Delete button disabled for non-admin sources.

### Step 6 — Route + Nav

Modified files:
- `src/app/router/AppRouter.tsx`
- `src/app/admin/components/AdminNav.tsx`

---

## Data Model: `source` Field

| source  | Can delete? | Price overwritten by refresh? |
|---------|-------------|-------------------------------|
| admin   | Yes         | No                            |
| mock    | No          | Yes                           |
| eodhd   | No          | Yes                           |

---

## Commit Strategy

1. `feat: add admin stock validators, API service, stub data, and hooks`
2. `feat: add admin stocks list page with search, filter, pagination`
3. `feat: add create stock modal`
4. `feat: add price update modal`
5. `feat: add stock delete with source-based permissions`
6. `feat: add admin stocks route and nav link`
