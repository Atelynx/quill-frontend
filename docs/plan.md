# Quill Frontend Plan

## Pending — v1.1.0 Remaining Features + Admin Module

### Phase 1 — Foundation Fixes

**Goal:** Currency rates REST fallback + registration username field.

| Step | File | Action |
|---|---|---|
| 1.1 | `src/shared/api/validators/currency.ts` | **New** — `CurrencyRateSchema` |
| 1.2 | `src/shared/api/validators/index.ts` | Add `export * from './currency'` |
| 1.3 | `src/shared/api/real-api-service.ts` | Add `currencyService` |
| 1.4 | `src/shared/api/stubbed-api-service.ts` | Add stub `currencyService` |
| 1.5 | `src/shared/api/stub-data.ts` | Add `STUB_CURRENCY_RATES` |
| 1.6 | `src/shared/api/api-service.ts` | Export `currencyService` |
| 1.7 | `src/shared/api/hooks/queries.ts` | Add `useForexRates()`, `useForexRate(symbol)` |
| 1.8 | `src/shared/hooks/useForexRate.ts` | REST query as WS fallback |
| 1.9 | `src/shared/content/strings.ts` | Add `usernameLabel` to `auth.register` |
| 1.10 | `src/app/auth/pages/AuthPage.tsx` | Add username field to register form |

**Files: 9 (1 new, 8 modified)**

---

### Phase 2 — Admin: User Role System

**Goal:** Add `role` field to user types, conditionally show admin UI.

| Step | File | Action |
|---|---|---|
| 2.1 | `src/shared/api/validators/auth.ts` | Add `role` to `UserProfileSchema` |
| 2.2 | `src/shared/api/stub-data.ts` | Add `role` to stubs |
| 2.3 | `src/shared/layout/AppShell.tsx` | Admin nav link (visible when `role === 'admin'`) |
| 2.4 | `src/app/router/AppRouter.tsx` | Add `AdminRoute` guard + `/admin/*` routes |
| 2.5 | `src/shared/content/strings.ts` | Add admin section strings |

**Files: 5 modified**

---

### Phase 3 — Admin: Config Module API Layer

**Goal:** React Query hooks + services for admin config CRUD + snapshots.

| Step | File | Action |
|---|---|---|
| 3.1 | `src/shared/api/validators/admin.ts` | **New** — Admin config + snapshot schemas |
| 3.2 | `src/shared/api/validators/index.ts` | Add `export * from './admin'` |
| 3.3 | `src/shared/api/real-api-service.ts` | Add `adminConfigService` (10 methods) |
| 3.4 | `src/shared/api/stubbed-api-service.ts` | Add stub `adminConfigService` |
| 3.5 | `src/shared/api/stub-data.ts` | Add stub admin configs + snapshots |
| 3.6 | `src/shared/api/api-service.ts` | Export `adminConfigService` |
| 3.7 | `src/shared/api/hooks/queries.ts` | Add 5 query hooks |
| 3.8 | `src/shared/api/hooks/mutations.ts` | Add 5 mutation hooks |

**Files: 8 (1 new, 7 modified)**

---

### Phase 4 — Admin: Config Management UI

**Goal:** Full admin panel — config list, edit/create, history, snapshots.

| Step | File | Action |
|---|---|---|
| 4.1 | `src/app/admin/layout/AdminLayout.tsx` | **New** — Admin layout shell |
| 4.2 | `src/app/admin/pages/AdminConfigPage.tsx` | **New** — Config list page |
| 4.3 | `src/app/admin/pages/AdminSnapshotsPage.tsx` | **New** — Snapshots page |
| 4.4 | `src/app/admin/components/ConfigEditModal.tsx` | **New** — Edit config modal |
| 4.5 | `src/app/admin/components/ConfigCreateForm.tsx` | **New** — Create config form |
| 4.6 | `src/app/admin/components/ConfigHistoryView.tsx` | **New** — Config version history |
| 4.7 | `src/app/admin/components/SnapshotRestoreDialog.tsx` | **New** — Restore confirmation |
| 4.8 | `src/app/admin/components/AdminNav.tsx` | **New** — Sub-navigation tabs |
| 4.9 | `src/app/router/AppRouter.tsx` | Add `/admin/config`, `/admin/snapshots` routes |

**Files: 8 new**

---

### Phase 5 — Market Hours Error Handling

| Step | File | Action |
|---|---|---|
| 5.1 | `src/app/orders/components/OrderForm.tsx` | Handle 400 error on MARKET orders |

**Files: 1 modified**

---

## Rules Compliance

| Rule | Approach |
|---|---|
| §1 — <400 lines/component | Each component is a focused file; if AdminConfigPage grows, split further |
| §2 — Reuse design system | Use `SectionCard`, `button.*`, `surface.*`, `fieldGroup`, `inputBase`, `fieldLabel` |
| §3 — Data flow | React Query for server data, local state for modals, no prop drilling |
| §4 — State management | Admin state in React Query cache; modal/dialog state kept local, not Redux |

## Total

| Phase | New files | Modified files | Est. lines |
|---|---|---|---|
| 1 — Foundation | 1 | 8 | ~150 |
| 2 — Role system | 0 | 5 | ~80 |
| 3 — Admin API layer | 1 | 7 | ~350 |
| 4 — Admin UI | 8 | 1 | ~600 |
| 5 — Market hours | 0 | 1 | ~15 |
| **Total** | **10** | **22** | **~1,195** |
